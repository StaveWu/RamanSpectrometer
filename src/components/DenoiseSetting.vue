<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>

      <v-flex pb-2 xs12 v-if="isSG()">
        <h3>参数设置</h3>
      </v-flex>
      
      <v-flex>
        <v-card>
          <sg-filter v-if="isSG()"></sg-filter>
        </v-card>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="denoise()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SGFilter from '@/components/SGFilter.vue'
import Component from 'vue-class-component';
import Axios, { AxiosResponse } from 'axios';
import store from '@/store';
import { Series } from '@/utils';
import RepositoryFactory from '@/repositories/RepositoryFactory';

const DenoiseRepository = RepositoryFactory.get('denoise');

enum DenoiseAlogrithm {
  SG = 'S-G滤波',
  WAVELET = '小波变换',
  DAE = '卷积去噪自编码器'
}

@Component({
  components: {
    'sg-filter': SGFilter
  }
})
export default class DenoiseSetting extends Vue {
  selected: DenoiseAlogrithm = DenoiseAlogrithm.SG;
  items: Array<DenoiseAlogrithm> = [
    DenoiseAlogrithm.SG, 
    DenoiseAlogrithm.WAVELET, 
    DenoiseAlogrithm.DAE
  ];
  
  isSG(): boolean {
    return this.selected === DenoiseAlogrithm.SG;
  }
  
  denoise(): void {
    this.$root.$emit('preprocess', this.getUri());
  }
  private getUri() {
    let res = 'http://127.0.0.1:5000/api/v1/denoises/';
    switch (this.selected) {
      case DenoiseAlogrithm.SG: 
        res += 'sgfilter';
        break;
      case DenoiseAlogrithm.WAVELET:
        res += 'wavelet';
        break;
      case DenoiseAlogrithm.DAE:
        res += 'dae';
        break;
      default:
        throw new Error('can not reach here!');
    }
    return res;
  }

  confirm() {
    this.$root.$emit('preprocessConfirmed');
  }
}
</script>


