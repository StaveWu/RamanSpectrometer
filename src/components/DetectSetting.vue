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
                  <spectrum :datas="datas"></spectrum>
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

@Component({
  components: {
    Spectrum
  }
})
export default class DetectSetting extends Vue {
  selected: Array<string> = ['乙醇', 'DMSO'];
  componentsToDetect: Array<string> = ['甲醇', '乙醇', 'DMF', 'DMSO'];
  datas: Array<Series> = [{name: '', data: [1, 2, 3, 9, 12]}];
  isDetected: boolean = false;

  expand: boolean = false;
  headers: Array<any> = [
    {text: 'id', value: 'id'},
    {text: '组分名', value: 'componentName'},
    {text: '存在的概率', value: 'probability'}
  ];
  results: Array<any> = [
    {id: 1, componentName: '乙醇', probability: '100%'},
    {id: 2, componentName: 'DMSO', probability: '100%'},
    {id: 3, componentName: 'DMF', probability: '8%'},
  ]

  detect() {
    console.log('detect...');
    this.isDetected = true;
  }
}

</script>
