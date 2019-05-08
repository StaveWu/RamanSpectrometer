<template>
  <div>
    <v-container fluid>
      <v-layout wrap>
        <v-flex xs12>
          <h3>光谱波段选择</h3>
        </v-flex>

        <v-flex
          shrink
          style="width: 60px"
        >
          <v-text-field
            v-model="wavenumbersRange[0]"
            class="mt-0"
            hide-details
            single-line
            type="number"
          ></v-text-field>
        </v-flex>

        <v-flex px-3>
          <v-range-slider
            v-model="wavenumbersRange"
            :max="3000"
            :min="0"
            :step="1"
          ></v-range-slider>
        </v-flex>

        <v-flex
          shrink
          style="width: 60px"
        >
          <v-text-field
            v-model="wavenumbersRange[1]"
            class="mt-0"
            hide-details
            single-line
            type="number"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 pt-4>
          <h3>批量识别预处理Pipeline</h3>
        </v-flex>
        <v-flex xs12 pb-3>
          <v-text-field
            :value="steps"
            hint="这里最多只能设置6步"
            label="# of steps"
            max="6"
            min="1"
            persistent-hint
            type="number"
            @input="onInput"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 pb-5>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <template v-for="n in steps">
                <v-stepper-step
                  :key="`${n}-step`"
                  :complete="e1 > n"
                  :step="n"
                  editable
                >
                  Step {{ n }}
                </v-stepper-step>

                <v-divider
                  v-if="n !== steps"
                  :key="n"
                ></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                v-for="n in steps"
                :key="`${n}-content`"
                :step="n"
              >
                <v-container fluid>
                  <v-layout wrap>
                    <v-flex text-xs-left xs12>
                      <v-combobox v-model="selected[n - 1]" :items="items" chips label="请选择预处理算法"></v-combobox>
                    </v-flex>
                    
                    <v-flex text-xs-left xs12>
                      <air-pls v-if="isAIRPLS(n - 1)" v-model="airplsParams"></air-pls>
                      <sg-filter v-if="isSG(n - 1)" v-model="sgfilterParams"></sg-filter>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-btn
                  color="primary"
                  @click="nextStep(n)"
                >
                  确定
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-flex>

        <v-flex xs12>
          <h3>主题设置</h3>
        </v-flex>
        <v-flex xs12 pb-4>
          <v-switch v-model="dark" color="primary" label="白-黑" persistent-hint></v-switch>
        </v-flex>

        <v-flex xs12>
          <h3>关于拉曼光谱识别软件</h3>
        </v-flex>
        <v-flex xs12>
          <v-subheader>当前版本：0.1.0</v-subheader>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import SGFilter from '@/components/SGFilter.vue'
import airPLS from '@/components/AIRPLS.vue';
import RepositoryFactory from '../repositories/RepositoryFactory';
import { AxiosResponse, AxiosError } from 'axios';
import { Pipeline } from '../utils';
import { Algorithm,
  SG,
  DAE,
  WAVELET,
  AIRPLS,
  POLYFIT,
  SVD_MAD,
  MINMAX_SCALE,
  SCALE } from '../common/Algorithm';

const SettingsRepository = RepositoryFactory.get('settings');

@Component({
  components: {
    'sg-filter': SGFilter,
    'air-pls': airPLS
  }
})
export default class Settings extends Vue {
  dark: boolean = false;
  wavenumbersRange: Array<number> = [0, 3000];
  e1: number = 1;
  steps: number = 0;
  selected: Algorithm[] = [];
  items: Array<Algorithm> = [
    MINMAX_SCALE,
    SCALE,
    SG, 
    WAVELET, 
    DAE,
    AIRPLS,
    POLYFIT,
    SVD_MAD,
  ]; 

  pipeline: Pipeline[] = [];

  sgfilterParams: any = {order: 3, windowLength: 9};
  airplsParams: any = {lambda: 1e4};

  constructor() {
    super();
    // init waverange
    SettingsRepository.getWavenumbersRange()
    .then((resp: AxiosResponse) => {
      this.wavenumbersRange = [resp.data.start, resp.data.end];
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });

    // init pipeline
    SettingsRepository.getPipeline()
    .then((resp: AxiosResponse) => {
      resp.data.foreach((ele: any) => {
        this.pipeline.push({
          method: ele.method,
          params: ele.params
        });
      });

      this.steps = this.pipeline.length;
      this.pipeline.forEach(ele => {
        let algorithm = this.items.filter(e => e.value === ele.method)[0];
        this.selected.push(algorithm);
        if (algorithm === SG) {
          this.sgfilterParams = ele.params;
        } else if (algorithm === AIRPLS) {
          this.airplsParams = ele.params;
        }
      });
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
  }

  @Watch('dark')
  switchTheme() {
    this.$store.commit('setDark', this.dark);
  }

  mounted() {
    this.dark = this.$store.getters.dark;
  }

  @Watch('wavenumbersRange', {deep: true})
  wavenumbersRangeUpdated() {
    SettingsRepository.setWavenumbersRange(this.wavenumbersRange[0], this.wavenumbersRange[1])
    .catch((error: AxiosError) =>{
      console.log(error);
    });
  }

  onInput(val: string) {
    this.steps = parseInt(val);
  }

  nextStep(n: number) {
    if (n === this.steps) {
      this.e1 = 1;
      // send pipeline settings
      SettingsRepository.setPipeline(this.pipeline)
      .catch((error: AxiosError) => {
        console.log(error);
      });
    } else {
      this.e1 = n + 1;
    }
  }

  isAIRPLS(i: number) {
    return this.selected[i] === AIRPLS;
  }

  isSG(i: number) {
    return this.selected[i] === SG;
  }
}
</script>
