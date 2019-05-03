<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择基线校正算法"></v-combobox>
      </v-flex>
      
      <v-flex text-xs-left md12 xs12 sm12 lg12>
        <air-pls v-if="isAIRPLS()"></air-pls>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="debackground()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import airPLS from '@/components/AIRPLS.vue'
import Axios, { AxiosResponse } from 'axios'


enum DebackgroundAlogrithm {
  AIRPLS = 'airPLS',
  POLYFIT = '多项式拟合'
}

@Component({
  components: {
    'air-pls': airPLS
  }
})
export default class DebackgroundSetting extends Vue {
  selected: DebackgroundAlogrithm = DebackgroundAlogrithm.AIRPLS;
  items: Array<DebackgroundAlogrithm> = [
    DebackgroundAlogrithm.AIRPLS,
    DebackgroundAlogrithm.POLYFIT
  ];
  
  isAIRPLS(): boolean {
    return this.selected === DebackgroundAlogrithm.AIRPLS;
  }

  debackground(): void {
    this.$root.$emit('preprocess', this.getUri());
  }
  private getUri() {
    let res = 'http://127.0.0.1:5000/api/v1/debackgrounds/';
    switch (this.selected) {
      case DebackgroundAlogrithm.AIRPLS: 
        res += 'airpls';
        break;
      case DebackgroundAlogrithm.POLYFIT:
        res += 'polyfit';
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

