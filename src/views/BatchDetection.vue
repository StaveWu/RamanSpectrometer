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
              <v-btn icon>
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn icon>
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
              <v-btn icon>
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
                      <spectrum :datas="datas"></spectrum>
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
import {Series} from '@/utils'
import Spectrum from '@/components/Spectrum.vue';

interface TargetListObject {
  file: string;
  folder: string;
}

interface ResultRowViewObject {
  file: string;
  probabilities: Array<string>;
}

@Component({
  components: {
    Spectrum
  }
})
export default class BatchDetection extends Vue {
  selected: Array<string> = ['甲醇', '乙醇', 'DMF', 'DMSO'];
  componentsToDetect: Array<string> = ['甲醇', '乙醇', 'DMF', 'DMSO'];
  datas: Array<Series> = [{name: '', data: [1, 2, 3, 9, 12]}];
  isDetected = false;
  showFeedbackPart = false;
  
  targetItems: Array<TargetListObject> = [
    {file: '1hao-1s', folder: 'E:/04文档/硕士毕业设计/数据/烟草/样品'},
    {file: '2hao-1s', folder: 'E:/04文档/硕士毕业设计/数据/烟草/样品'},
    {file: '3hao-1s', folder: 'E:/04文档/硕士毕业设计/数据/烟草/样品'},
    {file: '4hao-1s', folder: 'E:/04文档/硕士毕业设计/数据/烟草/样品'},
  ]

  headers: Array<any> = [];
  results: Array<ResultRowViewObject> = [];

  detect() {
    // 清空table
    this.headers.length = 0;
    this.results.length = 0;

    // 完善headers
    this.headers.push({text: '文件名', value: 'fileName'});
    for (let i = 0; i < this.selected.length; i++) {
      this.headers.push({text: this.selected[i], value: i.toString()});
    }
    
    // 完善行对象
    this.results = [
      {file:'1hao-1s', probabilities: ['100%', '95%', '93%', '99%']},
      {file:'2hao-1s', probabilities: ['100%', '95%', '93%', '99%']},
      {file:'3hao-1s', probabilities: ['100%', '95%', '93%', '99%']},
      {file:'4hao-1s', probabilities: ['100%', '95%', '93%', '99%']},
    ]
    this.isDetected = true;
    this.showFeedbackPart = false;
  }
}
</script>
