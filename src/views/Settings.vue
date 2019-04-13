<template>
  <div>
    <v-container fluid>
      <v-layout wrap>
        <v-flex xs12>
          <h3>波数区段选择</h3>
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
                      <v-combobox v-model="selected" :items="items" chips label="请选择预处理算法"></v-combobox>
                    </v-flex>

                    <v-flex xs12>
                      <h3>参数设置</h3>
                    </v-flex>
                    
                    <v-flex text-xs-left xs12>
                      <air-pls v-if="isAIRPLS()"></air-pls>
                      <sg-filter v-if="isSG()"></sg-filter>
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
        <v-flex xs12 pb-5>
          <v-switch v-model="dark" color="primary" label="白-黑" hint="切换到其他页后更新" persistent-hint></v-switch>
        </v-flex>

        <v-flex xs12>
          <h3>关于拉曼光谱识别软件</h3>
        </v-flex>
        <v-flex xs12>
          <v-subheader>当前版本：1.0.0</v-subheader>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import SGFilter from '@/components/SGFilter.vue'
import airPLS from '@/components/AIRPLS.vue'

enum Alogrithm {
  SG = 'S-G滤波',
  WAVELET = '小波变换',
  DAE = '去噪自编码器',
  AIRPLS = 'airPLS',
  POLYFIT = '多项式拟合'
}

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
  steps: number = 2;

  selected: Alogrithm = Alogrithm.SG;
  items: Array<Alogrithm> = [
    Alogrithm.SG, 
    Alogrithm.WAVELET, 
    Alogrithm.DAE,
    Alogrithm.AIRPLS,
    Alogrithm.POLYFIT
  ]; 

  @Watch('dark')
  switchTheme() {
    Vue.prototype.dark = this.dark;
  }

  mounted() {
    this.dark = this.getDark();
  }

  private getDark() {
    let res = Vue.prototype.dark;
    if (res === undefined) {
      res = false;
    }
    return res;
  }

  onInput(val: string) {
    this.steps = parseInt(val);
  }

  nextStep (n: number) {
    if (n === this.steps) {
      this.e1 = 1
    } else {
      this.e1 = n + 1
    }
  }

  isAIRPLS(): boolean {
    return this.selected === Alogrithm.AIRPLS;
  }

  isSG(): boolean {
    return this.selected === Alogrithm.SG;
  }
}
</script>
