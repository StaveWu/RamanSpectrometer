<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h1>{{ dialogTitle }}</h1>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.componentName" label="组分名" :disabled="disabled"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.formula" label="化学式"></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-btn color="primary" @click="importSpectraFromFile">上传光谱</v-btn>
              </v-flex>

              <v-flex>
                <v-card flat>
                  <v-responsive :aspect-ratio="16/9">
                    <spectrum :datas="[editedItem.series]"></spectrum>
                  </v-responsive>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="close">取消</v-btn>
          <v-btn color="blue darken-1" flat @click="save">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container>
      <v-layout align-center wrap>
        <v-flex grow>
          <v-text-field
            placeholder="Search..."
            clearable
            prepend-inner-icon="search"
            v-model="search"
          ></v-text-field>
        </v-flex>

        <v-flex shrink pl-3>
          <v-btn color="primary" @click="newItem">新建组分</v-btn>
        </v-flex>

        <v-flex xs12 pt-3>
          <v-card>
            <v-data-table
              :headers="headers"
              :items="components"
              :search="search"
              expand="expand"
              item-key="componentName"
            >
              <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                  <td>{{ props.item.componentName }}</td>
                  <td class="text-xs-right">{{ props.item.formula }}</td>
                  <td class="text-xs-right">
                    <span v-if="props.item.state === 'offline'" class="offline">离线</span>
                    <span v-if="props.item.state === 'online'" class="online">在线</span>
                    <span v-if="props.item.state === 'busy'" class="busy">忙碌</span>
                  </td>
                  <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-responsive :aspect-ratio="16/9">
                    <spectrum :datas="[props.item.series]"></spectrum>
                  </v-responsive>
                </v-card>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Spectrum from "@/components/Spectrum.vue";
import { remote } from "electron";
import fs from "fs";
import { ComponentDO, SpectrumDO } from "@/utils";
import ComponentRepository from "../repositories/ComponentRepository";
import { AxiosResponse, AxiosError } from "axios";
import path from "path";

@Component({
  components: {
    Spectrum
  }
})
export default class PureLibrary extends Vue {
  dialog: boolean = false;
  editedIndex: number = -1;
  editedItem: ComponentDO = new ComponentDO("", [new SpectrumDO("", [])], "");
  defaultItem: ComponentDO = new ComponentDO("", [new SpectrumDO("", [])], "");

  expand: boolean = false;
  headers: Array<any> = [
    { text: "组分名", value: "componentName" },
    { text: "化学式", value: "formula" },
    { text: "模型状态", value: "state" },
    { text: "操作", value: "actions", sortable: false }
  ];
  components: Array<ComponentDO> = [];

  search: string = "";

  constructor() {
    super();
    ComponentRepository.loadComponents()
      .then((response: AxiosResponse) => {
        response.data.components.forEach((comp: any) => {
          this.components.push(ComponentDO.fromJson(comp));
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  newItem() {
    this.editItem(this.defaultItem);
  }

  editItem(item: ComponentDO) {
    this.editedIndex = this.components.indexOf(item);
    this.editedItem = Object.create(item);
    this.dialog = true;
  }

  deleteItem(item: ComponentDO) {
    const index = this.components.indexOf(item);
    if (confirm("确定要删除该组分吗?")) {
      if (item.id === undefined) {
        return;
      }
      ComponentRepository.removeComponent(item.id)
        .then((response: AxiosResponse) => {
          this.components.splice(index, 1);
        })
        .catch((error: AxiosError) => {
          console.log(error);
        });
    }
  }

  get dialogTitle() {
    return this.editedIndex == -1 ? "新建组分" : "编辑组分";
  }

  get disabled() {
    return this.editedIndex == -1 ? false : true;
  }

  close() {
    this.dialog = false;
    setTimeout(() => {
      this.editedItem = Object.create(this.deleteItem);
      this.editedIndex = -1;
    }, 300);
  }

  save() {
    if (this.editedIndex > -1) {
      // 更新组分
      ComponentRepository.updateComponent(this.editedItem)
        .then((response: AxiosResponse) => {
          this.editedItem.id = response.data.id;
          this.$set(
            this.components,
            this.editedIndex,
            Object.create(this.editedItem)
          );
        })
        .catch((error: AxiosError) => {
          console.log(error);
        });
    } else {
      // 新建组分
      ComponentRepository.addComponent(this.editedItem)
        .then((response: AxiosResponse) => {
          this.editedItem.id = response.data.id;
          this.components.push(this.editedItem);
        })
        .catch((error: AxiosError) => {
          console.log(error);
        });
    }
    this.close();
  }

  importSpectraFromFile() {
    const selectedFilePaths = remote.dialog.showOpenDialog({
      properties: ["openFile"]
    });
    if (selectedFilePaths === undefined) {
      return;
    } else {
      fs.readFile(selectedFilePaths[0], (err, data) => {
        if (err) {
          return console.error(err);
        } else {
          this.editedItem.owned_spectra.push(SpectrumDO.fromFile(selectedFilePaths[0], data));
        }
      });
    }
  }
}
</script>

<style>
.offline {
  color: #f44336;
}
.online {
  color: #4caf50;
}
.busy {
  color: #ff9800;
}
</style>

