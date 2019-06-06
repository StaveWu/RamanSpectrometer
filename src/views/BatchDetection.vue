<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout wrap align-center>
        <v-flex text-xs-left xs12>
          <v-combobox
            v-model="selected"
            :items="componentsToDetect"
            chips
            multiple
            label="请选择要识别的组分"
          ></v-combobox>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12>
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>目标光谱</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="uploadSpectra()">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon @click="clearSpectra()">
                <v-icon>clear_all</v-icon>
              </v-btn>
            </v-toolbar>

            <v-list two-line>
              <v-list-tile v-for="item in targetItems" :key="item.id">
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.folder }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12 text-xs-center>
          <v-btn color="primary" @click="detect()">批量识别</v-btn>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12>
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>识别结果</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="saveReport()">
                <v-icon>save_alt</v-icon>
              </v-btn>
            </v-toolbar>

            <v-list v-if="isDetected">
              <v-data-table :headers="headers" :items="results" expand="expand" item-key="name">
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.name }}</td>
                    <td
                      class="text-xs-right"
                      v-for="i in props.item.probabilities.length"
                      :key="i"
                    >{{ props.item.probabilities[i-1] }}</td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-responsive :aspect-ratio="16/9">
                      <spectrum :datas="props.item.spectrum"></spectrum>
                    </v-responsive>

                    <v-card-actions>
                      <v-container>
                        <v-layout>
                          <v-flex xs12 text-xs-right>
                            <v-btn
                              outline
                              color="warning"
                              @click="showFeedbackPart = !showFeedbackPart"
                            >预测有误?</v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-actions>

                    <v-divider v-if="showFeedbackPart"></v-divider>

                    <v-slide-y-transition>
                      <v-container fluid v-if="showFeedbackPart">
                        <v-layout wrap align-center>
                          <v-flex v-for="comp in selected" :key="comp">
                            <v-checkbox color="primary" :label="comp"></v-checkbox>
                          </v-flex>

                          <v-flex xs12 text-xs-right>
                            <v-btn outline color="success" @click="showFeedbackPart = false">反馈</v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-slide-y-transition>
                  </v-card>
                </template>
              </v-data-table>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { SpectrumDO, ComponentDO } from "@/models";
import { AxiosResponse, AxiosError } from "axios";
import Spectrum from "@/components/Spectrum.vue";
import ComponentRepository from "../repositories/ComponentRepository";
import SpectraRepository from "../repositories/SpectraRepository";
import { remote } from "electron";
import fs from "fs";
import path from "path";

interface TargetListObject {
  id: number;
  name: string;
  folder: string;
  data: number[][];
}

interface ResultRowObject {
  name: string;
  probabilities: Array<string>;
  spectraCompare: Array<SpectrumDO>;
}

@Component({
  components: {
    Spectrum
  }
})
export default class BatchDetection extends Vue {
  components: Array<ComponentDO> = []; // cache component data
  selected: Array<string> = [];
  componentsToDetect: Array<string> = [];
  isDetected = false;
  showFeedbackPart = false;

  targetItems: Array<TargetListObject> = [];

  headers: Array<any> = [];
  results: Array<ResultRowObject> = [];

  constructor() {
    super();
    ComponentRepository.loadComponents()
      .then((comps: Array<ComponentDO>) => {
        // init comboBox content
        comps
          .filter(comp => comp.state === "online")
          .map(comp => this.componentsToDetect.push(comp.name));
        // cache components data
        comps.forEach(comp => this.components.push(comp));
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  detect() {
    // 清空table
    this.headers.length = 0;
    this.results.length = 0;
    this.showFeedbackPart = false;
    this.isDetected = false;

    // 完善headers
    this.headers.push({ text: "文件名", value: "fileName" });
    for (let i = 0; i < this.selected.length; i++) {
      this.headers.push({ text: this.selected[i], value: i.toString() });
    }

    // 完善行对象
    // DetectRepository.batchDetectComponents(
    //   this.targetItems.map(ele => ele.series),
    //   this.selected
    // )
    //   .then((response: AxiosResponse) => {
    //     for (let i = 0; i < response.data.results.length; i++) {
    //       let res = response.data.results[i];
    //       this.results.push({
    //         file: res.name,
    //         probabilities: res.probabilities,
    //         series: [
    //           this.targetItems[i].series,
    //           { name: this.components[i].name, data: this.components[i].data }
    //         ]
    //       });
    //     }
    //     this.isDetected = true;
    //   })
    //   .catch((error: Error) => {
    //     console.log(error);
    //   });
  }

  uploadSpectra() {
    const selectedFilePaths = remote.dialog.showOpenDialog({
      properties: ["multiSelections"]
    });
    if (selectedFilePaths === undefined) {
      // skip if not select
      return;
    } else {
      selectedFilePaths.forEach(pathname => {
        SpectrumDO.fromFile(pathname)
          .then((spec) => {
            let spectrum = <SpectrumDO>spec;
            SpectraRepository.addSpectrum(<SpectrumDO>spec)
              .then(() => {
                this.targetItems.push({
                  id: spectrum.id,
                  name: spectrum.name,
                  folder: path.parse(pathname).dir,
                  data: spectrum.data
                });
              })
          })
      });
    }
  }

  clearSpectra() {
    this.targetItems.splice(0, this.targetItems.length);
    this.results.splice(0, this.results.length);
    this.isDetected = false;
  }

  saveReport() {
    const pathname = remote.dialog.showSaveDialog({ title: "识别报告保存为" });
    if (pathname === undefined) {
      return;
    } else {
      let dataToWriteArr = new Array<string>();
      dataToWriteArr.push(this.headers.map(ele => ele.text).join("\t"));
      this.results.map(obj => {
        dataToWriteArr.push([obj.name, ...obj.probabilities].join("\t"));
      });
      let dataToWrite = dataToWriteArr.join("\r\n");

      fs.writeFile(pathname, dataToWrite, { encoding: "utf8" }, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}
</script>
