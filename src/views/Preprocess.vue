<template>
  <div>
    <v-tabs centered>
      <v-tab :key="1">光谱去噪</v-tab>
      <v-tab :key="2">基线校正</v-tab>
      <v-tab :key="3">组分识别</v-tab>
      <v-tab-item :key="1">
        <denoise-setting/>
      </v-tab-item>
      <v-tab-item :key="2">
        <debackground-setting></debackground-setting>
      </v-tab-item>
      <v-tab-item :key="3">
        <detect-setting></detect-setting>
      </v-tab-item>
    </v-tabs>

    <v-container fluid>
      <v-layout wrap>
        <v-flex pb-2 xs12>
          <h3>波形显示</h3>
        </v-flex>

        <v-flex xs12>
          <v-card>
            <v-responsive :aspect-ratio="16/9">
              <spectrum :datas="datas"></spectrum>
            </v-responsive>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DenoiseSetting from '@/components/DenoiseSetting.vue';
import DebackgroundSetting from '@/components/DebackgroundSetting.vue';
import DetectSetting from '@/components/DetectSetting.vue';

import Spectrum from '@/components/Spectrum.vue';
import Component from 'vue-class-component';
import {Series} from '@/utils'

@Component({
  components: {
    DenoiseSetting,
    DebackgroundSetting,
    DetectSetting,
    Spectrum,
  }
})
export default class PreprocessView extends Vue {
  datas: Array<Series> = [];

  constructor() {
    super();
    
    // the first time spectrum can't catch this event, and then spectrum is lost.
    this.datas.push(this.getSpectraData());
  }

  created() {
    this.$root.$on('preprocessReceived', (name: string, data: Array<any>) => {
      this.datas.push({name: name, data: data});
    });
    this.$root.$on('preprocessConfirmed', () => {
      if (this.datas.length == 0) {
        return;
      }
      this.datas.splice(0, 1);
    });
  }

  beforeDestroy() {
    this.$root.$off('preprocessReceived');
    this.$root.$off('preprocessConfirmed');
  }

  private getSpectraData(): Series {
    // init data from global attribute.
    let res = Vue.prototype.spectraData;
    if (res === undefined) {
      res = {name: '', data: []};
    }
    return res;
  }
}
</script>
