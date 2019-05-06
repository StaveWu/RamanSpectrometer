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
          <v-data-table :headers="headers" :items="results" expand="expand" item-key="componentName">
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ props.item.componentName }}</td>
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
import { AxiosResponse, AxiosError } from 'axios'
import { Prop } from 'vue-property-decorator';
import RepositoryFactory from '../repositories/RepositoryFactory';

const ComponentRepository = RepositoryFactory.get('component');
const DetectRepository = RepositoryFactory.get('detect');

interface ComponentsViewObject {
  componentName: string;
  formula: string;
  probability: string;
  series: Array<Series>;
}

interface PureComponent {
  name: string;
  data: number[][][]; // e.g. (5, 3000, 2)
  state: string;
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

  expand: boolean = false;
  headers: Array<any> = [
    {text: '组分名', value: 'componentName'},
    {text: '化学式', value: 'formula'},
    {text: '存在的概率', value: 'probability'}
  ];
  results: Array<ComponentsViewObject> = [];

  constructor() {
    super();
    ComponentRepository.loadComponents()
    .then((response: AxiosResponse) => {
      this.componentsToDetect = response.data
      .filter((component: PureComponent) => component.state === 'online')
      .map((component: PureComponent) => component.name)
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
  }

  detect() {
    DetectRepository.detectComponents(
      this.$store.getters.targetSpectra.name.split('-')[0],
      this.$store.getters.targetSpectra.data,
      this.selected
    )
    .then((response: AxiosResponse) => {
      for (let rev of response.data) {
        this.results.push({
          componentName: rev.name,
          formula: rev.formula,
          probability: rev.probability,
          series: [this.$store.state.targetSpectra, {name: rev.name, data: rev.data}]
        })
      };
      this.isDetected = true;
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
  }
}

</script>
