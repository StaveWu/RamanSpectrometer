<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择常规操作"></v-combobox>
      </v-flex>

      <v-flex text-xs-right pt-3>
        <v-btn color="primary" @click="preprocess()">应用</v-btn>
        <v-btn color="primary" @click="confirm()">确定</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import store from '../store'
import { Series } from '../utils'

enum ConventionalActions {
  MINMAX_SCALE = '归一化',
  SCALE = '标准化'
}

@Component
export default class ConventionalSetting extends Vue {
  selected: ConventionalActions = ConventionalActions.MINMAX_SCALE;
  items: Array<ConventionalActions> = [
    ConventionalActions.MINMAX_SCALE,
    ConventionalActions.SCALE
  ];

  preprocess() {
    Axios.post(this.getUri(), store.getters.targetSpectra)
    .then((response: AxiosResponse) => {
      store.commit('enqueue', new Series(response.data.name, response.data.data));
    })
    .catch((error: any) => {
      console.log(error);
    });
  }
  private getUri() {
    let res = 'http://127.0.0.1:5000/api/v1/conventionals/'
    if (this.selected === ConventionalActions.MINMAX_SCALE) {
      res += 'minmax-scale';
    } else if (this.selected === ConventionalActions.SCALE) {
      res += 'scale';
    } else {
      throw new Error('can not reach here!')
    }
    return res;
  }

  confirm() {
    store.commit('dequeue')
  }
}
</script>
