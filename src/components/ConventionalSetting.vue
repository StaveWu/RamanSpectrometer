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
import { AxiosResponse, AxiosError } from 'axios'
import store from '../store'
import { Series } from '../utils';
import { Algorithm, MINMAX_SCALE, SCALE } from '../common/Algorithm'
import RepositoryFactory from '@/repositories/RepositoryFactory';

const ConventionalRepository = RepositoryFactory.get('conventional');

@Component
export default class ConventionalSetting extends Vue {
  selected: Algorithm = MINMAX_SCALE;
  items: Array<Algorithm> = [
    MINMAX_SCALE,
    SCALE
  ];
  parameters?: any;

  preprocess() {
    ConventionalRepository.get(this.selected.value, this.parameters)
    .then((response: AxiosResponse) => {
      store.commit('enqueue', new Series(response.data.name, response.data.data));
    })
    .catch((error: AxiosError) => {
      console.log(error);
    });
  }

  confirm() {
    if (store.state.spectraDeque.length > 1) {
      store.commit('dequeue');
    }
  }
}
</script>
