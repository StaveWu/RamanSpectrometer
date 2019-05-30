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
                  <v-btn outline color="warning" @click="tagSpectra(props.item.componentName)">预测错误?</v-btn>
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
import { SpectrumDO, ComponentDO } from '@/utils'
import { AxiosResponse, AxiosError } from 'axios'
import { Prop } from 'vue-property-decorator';
import RepositoryFactory from '../repositories/RepositoryFactory';

const ComponentRepository = RepositoryFactory.get('component');
const DetectRepository = RepositoryFactory.get('detect');
const SpectraRepository = RepositoryFactory.get('spectra');

interface ComponentsViewObject {
  componentName: string;
  formula: string;
  probability: string;
  series: Array<Series>;
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
  components: Array<PureComponent> = []; // cache component data

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
      .map((component: PureComponent) => component.name);
      
      this.components = response.data;
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
  }

  private getTargetSpectraName() {
    return this.$store.getters.targetSpectra.name.split('-')[0];
  }

  detect() {
    let targetName = this.getTargetSpectraName();
    DetectRepository.detectComponents(
      targetName,
      this.$store.getters.targetSpectra.data,
      this.selected
    )
    .then((response: AxiosResponse) => {
      for (let rev of response.data) {
        let comp = this.getComponent(rev.name);
        this.results.push({
          componentName: rev.name,
          formula: comp.formula,
          probability: rev.probability,
          series: [this.$store.state.targetSpectra, {name: comp.name, data: comp.data}]
        })
      };
      this.isDetected = true;
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }
  private getComponent(compName: string) {
    let compOptional = this.components.filter((comp: PureComponent) => comp.name === compName);
    if (compOptional.length === 1) {
      return compOptional[0];
    }
    else {
      throw new Error(`find ${compOptional.length} of ${compName}`);
    }
  }

  tagSpectra(compName: string) {
    let probability = this.results.filter((comp: ComponentsViewObject) => {
      comp.componentName === compName
    })[0].probability;
    let fliped = parseFloat(probability) > 0.5 ? 0 : 1;
    SpectraRepository.tagSpectra(this.getTargetSpectraName(), compName, fliped);
  }
}

</script>
