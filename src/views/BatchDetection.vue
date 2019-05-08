<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout wrap align-center>
        <v-flex text-xs-left xs12>
          <v-combobox v-model="selected" :items="componentsToDetect" chips multiple label="请选择要识别的组分"></v-combobox>
        </v-flex>

        <v-flex xs12 sm12 md12 lg12>
          <v-card>
            <v-toolbar flat>
              <v-toolbar-title>目标光谱</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="uploadSpectras()">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon @click="clearSpectras()">
                <v-icon>clear_all</v-icon>
              </v-btn>
            </v-toolbar>

            <v-list two-line>
              <v-list-tile
                v-for="item in targetItems"
                :key="item.file"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.file }}</v-list-tile-title>
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
              <v-data-table :headers="headers" :items="results" expand="expand" item-key="file">
                <template slot="items" slot-scope="props">
                  <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.file }}</td>
                    <td class="text-xs-right"
                      v-for="i in props.item.probabilities.length" 
                      :key="i"
                    >
                      {{ props.item.probabilities[i-1] }}
                    </td>
                  </tr>
                </template>
                <template slot="expand" slot-scope="props">
                  <v-card flat>
                    <v-responsive :aspect-ratio="16/9">
                      <spectrum :datas="props.item.series"></spectrum>
                    </v-responsive>

                    <v-card-actions>
                      <v-container>
                        <v-layout>
                          <v-flex xs12 text-xs-right>
                            <v-btn outline color="warning" @click="showFeedbackPart = !showFeedbackPart">预测有误?</v-btn>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-actions>

                    <v-divider v-if="showFeedbackPart"></v-divider>

                    <v-slide-y-transition>
                      <v-container fluid v-if="showFeedbackPart">
                          <v-layout wrap align-center>
                            <v-flex 
                              v-for="comp in selected"
                              :key="comp"
                            >
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
import Vue from 'vue'
import Component from 'vue-class-component';
import {Series, PureComponent} from '@/utils';
import { AxiosResponse, AxiosError } from 'axios';
import Spectrum from '@/components/Spectrum.vue';
import RepositoryFactory from '../repositories/RepositoryFactory';
import {remote} from 'electron';
import fs from 'fs';
import path from 'path';

const ComponentRepository = RepositoryFactory.get('component');
const SpectraRepository = RepositoryFactory.get('spectra');
const DetectRepository = RepositoryFactory.get('detect');

interface TargetListObject {
  file: string;
  folder: string;
  series: Series;
}

interface ResultRowViewObject {
  file: string;
  probabilities: Array<string>;
  series: Array<Series>;
}

@Component({
  components: {
    Spectrum
  }
})
export default class BatchDetection extends Vue {
  components: Array<PureComponent> = []; // cache component data
  selected: Array<string> = [];
  componentsToDetect: Array<string> = [];
  isDetected = false;
  showFeedbackPart = false;
  
  targetItems: Array<TargetListObject> = [];

  headers: Array<any> = [];
  results: Array<ResultRowViewObject> = [];

  constructor() {
    super();
    ComponentRepository.loadComponents()
    .then((response: AxiosResponse) => {
      this.componentsToDetect = response.data
      .filter((component: any) => component.state === 'online')
      .map((component: any) => component.name);
      
      this.components = response.data;
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
    this.headers.push({text: '文件名', value: 'fileName'});
    for (let i = 0; i < this.selected.length; i++) {
      this.headers.push({text: this.selected[i], value: i.toString()});
    }
    
    // 完善行对象
    DetectRepository.batchDetectComponents(
      this.targetItems.map(ele => ele.series),
      this.selected
    )
    .then((response: AxiosResponse) => {
      for (let i = 0; i < response.data.results.length; i++) {
        let res = response.data.results[i];
        this.results.push({
          file: res.name,
          probabilities: res.probabilities,
          series: [this.targetItems[i].series, {name: this.components[i].name, data: this.components[i].data}]
        })
      };
      this.isDetected = true;
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  uploadSpectras() {
    const selectedFilePaths = remote.dialog.showOpenDialog({properties: ['multiSelections']});
    if (selectedFilePaths === undefined) { // skip if not select
      return;
    } 
    else {
      selectedFilePaths.forEach(p => {
        fs.readFile(p, (err, data) => {
          if (err) {
            return console.error(err);
          } 
          else {
            let name = path.parse(p).name;
            let folder = path.parse(p).dir;
            // access points
            let points = new Array<Array<number>>();
            data.toString().trim().split('\n').map(line => {
              let s = line.split('\t');
              points.push([parseFloat(s[0]), parseFloat(s[1])]);
            });

            this.targetItems.push({file: name, folder: folder, series: {name: name, data: points}});
            SpectraRepository.addSpectra(name, points)
            .catch((error: AxiosError) => {
              console.log(error);
            });
          }
        });
      });
    }
  }

  clearSpectras() {
    this.targetItems.splice(0, this.targetItems.length);
    this.results.splice(0, this.results.length);
    this.isDetected = false;
  }

  saveReport() {
    const pathname = remote.dialog.showSaveDialog({title: '识别报告保存为'});
    if (pathname === undefined) {
      return;
    } 
    else {
      let dataToWriteArr = new Array<string>();
      dataToWriteArr.push(this.headers.map(ele => ele.text).join('\t'));
      this.results.map(obj => {
        dataToWriteArr.push([obj.file, ...obj.probabilities].join('\t'));
      });
      let dataToWrite = dataToWriteArr.join('\r\n');

      fs.writeFile(pathname, dataToWrite, {encoding: 'utf8'}, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}
</script>
