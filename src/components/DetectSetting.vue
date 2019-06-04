<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex md12 xs12 lg12>
        <v-combobox v-model="selected" :items="componentsToDetect" chips multiple label="请选择要识别的组分"></v-combobox>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="detect()">识别</v-btn>
      </v-flex>

      <v-flex pb-2 xs12 v-if="isDetected">
        <h3>识别结果</h3>
      </v-flex>

      <v-flex v-if="isDetected">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="results"
            expand="expand"
            item-key="name"
          >
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.probability }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-card flat>
                <v-responsive :aspect-ratio="16/9">
                  <spectrum :datas="props.item.ownedSpectra"></spectrum>
                </v-responsive>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn outline color="warning" @click="tagSpectrum(props.item.comp)">预测错误?</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Spectrum from "@/components/Spectrum.vue";
import { SpectrumDO, ComponentDO, DetectResult } from "@/utils";
import { AxiosResponse, AxiosError } from "axios";
import { Prop } from "vue-property-decorator";
import ComponentRepository from "../repositories/ComponentRepository";
import SpectraRepository from "../repositories/SpectraRepository";

interface ComponentRowObject {
  id: number | undefined;
  name: string;
  formula: string | undefined;
  probability: number;
  ownedSpectra: SpectrumDO[];
}

@Component({
  components: {
    Spectrum
  }
})
export default class DetectSetting extends Vue {
  selected: Array<string> = [];
  componentsToDetect: Array<string> = [];
  isDetected: boolean = false;
  components: Array<ComponentDO> = []; // use for caching component data

  expand: boolean = false;
  headers: Array<any> = [
    { text: "组分名", value: "componentName" },
    { text: "化学式", value: "formula" },
    { text: "存在的概率", value: "probability" }
  ];
  results: Array<ComponentRowObject> = [];

  constructor() {
    super();
    ComponentRepository.loadComponents()
      .then((comps: Array<ComponentDO>) => {
        // init comboBox content
        comps
          .filter(comp => comp.state === "online")
          .map(comp => this.componentsToDetect.push(comp.name));
        // cache components data
        this.components = comps;
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  detect() {
    SpectraRepository.detectComponents(
      this.$store.state.targetSpectrum,
      this.getSelectIds()
    )
      .then((results: DetectResult[]) => {
        for (let res of results) {
          let comp = this.components.find(comp => comp.id == res.id);
          if (!comp) {
            continue;
          }
          this.results.push({
            id: comp.id,
            name: comp.name,
            formula: comp.formula,
            probability: res.probability,
            ownedSpectra: comp.ownedSpectra
          });
        }
        this.isDetected = true;
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }
  private getSelectIds() {
    let selectIds: number[] = [];
    this.selected.forEach(name => {
      let finded = this.components.find(comp => comp.name == name);
      if (finded && finded.id) {
        selectIds.push(finded.id);
      }
    });
    return selectIds;
  }

  tagSpectrum(comp: ComponentRowObject) {
    let fliped = comp.probability > 0.5 ? 0 : 1;
    SpectraRepository.tagSpectrum(
      this.$store.state.targetSpectrum.id,
      new DetectResult(comp.id, fliped)
    ).catch(err => {
      console.log(err);
    });
  }
}
</script>
