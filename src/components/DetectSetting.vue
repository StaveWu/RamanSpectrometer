<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
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
          <v-data-table :headers="headers" :items="results" expand="expand" item-key="id">
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.componentName }}</td>
                <td class="text-xs-right">{{ props.item.probability }}</td>
              </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-card flat>
                <v-responsive :aspect-ratio="16/9">
                  <spectrum :datas="props.item.series"></spectrum>
                </v-responsive>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn outline color="warning">预测错误?</v-btn>
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
import Vue from 'vue'
import Component from 'vue-class-component';
import Spectrum from '@/components/Spectrum.vue';
import {Series} from '@/utils'
import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Prop } from 'vue-property-decorator';


interface ComponentsViewObject {
  id: number;
  componentName: string;
  probability: string;
  series: Array<Series>;
}

@Component({
  components: {
    Spectrum
  }
})
export default class DetectSetting extends Vue {
  @Prop() targetSpectra!: Series;
  selected: Array<string> = ['乙醇', 'DMSO'];
  componentsToDetect: Array<string> = ['甲醇', '乙醇', 'DMF', 'DMSO'];
  isDetected: boolean = false;

  expand: boolean = false;
  headers: Array<any> = [
    {text: 'id', value: 'id'},
    {text: '组分名', value: 'componentName'},
    {text: '存在的概率', value: 'probability'}
  ];
  results: Array<ComponentsViewObject> = [];

  detect() {
    this.results.push({
      id: 1,
      componentName: '乙醇',
      probability: '0%',
      series: []
    });
    this.results.push({
      id: 2,
      componentName: 'DMSO',
      probability: '0%',
      series: []
    });
    this.isDetected = true;
    // tricky code
    Axios.get('http://127.0.0.1:5000/api/v1/trick/1').then((response: AxiosResponse) => {
      this.results.push({
        id: 1,
        componentName: response.data[1].name,
        probability: '100%',
        series: [
          {name: response.data[0].name, data: response.data[0].data},
          {name: response.data[1].name, data: response.data[1].data}
        ]
      })
      this.isDetected = true;
    }).catch((error: any) => {
      console.log(error);
    })
  }
}

</script>
