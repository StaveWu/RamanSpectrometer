<template>
  <div>
    <v-alert :value="alertShow" type="warning">{{ alertMessage }}</v-alert>

    <v-container>
      <v-layout wrap>
        <v-flex xs12 pb-2>
          <h2>导入</h2>
        </v-flex>
        <v-flex xs12 text-xs-left>
          <v-btn color="primary" @click="importSpectrumFromFile()">
            <v-icon left dark>folder_open</v-icon>从本地打开
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <v-flex xs12 pb-2>
          <h2>最近</h2>
        </v-flex>

        <v-flex text-xs-center v-if="onLoading">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-flex>

        <v-flex v-for="i in numRecentSpectra" :key="i" xs12 sm6 md4 lg4 xl4>
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 12 : 2}`"
              @click="openSpectrum(i - 1)"
              to="/preprocess"
            >
              <v-responsive :aspect-ratio="4/3">
                <spectrum :datas="[spectra[i - 1]]"></spectrum>
              </v-responsive>
            </v-card>
          </v-hover>
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
import { Series } from "@/utils";
import { AxiosResponse } from "axios";
import store from "../store";
import path from "path";
import SpectraRepository from "../repositories/SpectraRepository";

@Component({
  components: {
    Spectrum
  }
})
export default class Home extends Vue {
  onLoading: boolean = true;
  numRecentSpectra: number = 0;
  spectra: Array<Series> = [];
  alertMessage: string = "";
  alertShow: boolean = false;

  constructor() {
    super();
    this.onLoading = true;
  }

  created() {
    SpectraRepository.loadSpectra()
      .then((response: AxiosResponse) => {
        for (const s of response.data.spectra) {
          this.spectra.push({ name: s.name, data: s.data });
          this.numRecentSpectra = this.spectra.length;
        }
      })
      .catch((error: any) => {
        this.alertMessage = `最近数据加载失败: ${error}`;
        this.alertShow = true;
      })
      .then(() => {
        this.onLoading = false;
      });
  }

  openSpectrum(i: number) {
    this.postData(this.spectra[i]);
  }

  importSpectrumFromFile() {
    const selectedFilePaths = remote.dialog.showOpenDialog({
      properties: ["openFile"]
    });
    if (selectedFilePaths === undefined) {
      // skip if not select
      return;
    } else {
      // if select many, we only choose the first one
      fs.readFile(selectedFilePaths[0], (err, data) => {
        if (err) {
          return console.error(err);
        } else {
          // get filename as spectra's name
          let name = path.parse(selectedFilePaths[0]).name;
          // access points
          let points = new Array<Array<number>>();
          data
            .toString()
            .trim()
            .split("\n")
            .map(line => {
              let s = line.split("\t");
              points.push([parseFloat(s[0]), parseFloat(s[1])]);
            });
          SpectraRepository.addSpectrum(name, points)
            .then((response: AxiosResponse) => {
              // get id
            })
            .catch((error: any) => {
              this.alertMessage = `${error}`;
              this.alertShow = true;
            });
          // data should be posted before preprocess page created, since
          // this page need data to construct.
          this.postData({ name: name, data: points });
          this.$router.push("/preprocess");
        }
      });
    }
  }

  private postData(data: Series) {
    store.commit("clear");
    store.commit("enqueue", data);
  }
}
</script>
