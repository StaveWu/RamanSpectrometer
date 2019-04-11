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
        <h3>基线</h3>
      </v-tab-item>
      <v-tab-item :key="3">
        <h3>组分识别</h3>
      </v-tab-item>
    </v-tabs>

    <v-container fluid>
      <v-layout wrap>
        <v-flex>
          <v-card>
            <v-responsive :aspect-ratio="16/9">
              <spectrum :title="title" :data="data"></spectrum>
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
import Spectrum from '@/components/Spectrum.vue';
import Component from 'vue-class-component';

@Component({
  components: {
    DenoiseSetting,
    Spectrum,
  }
})
export default class PreprocessView extends Vue {
  data: Array<number> = [];
  title: string = 'Raman Spectra';

  constructor() {
    super();
    
    // the first time spectrum can't catch this event, and then spectrum is lost.
    this.data = this.getSpectraData();
  }

  private getSpectraData(): Array<number> {
    // init data from global attribute.
    let res = Vue.prototype.spectraData;
    if (res === undefined) {
      res = [];
    }
    return res;
  }
}
</script>
