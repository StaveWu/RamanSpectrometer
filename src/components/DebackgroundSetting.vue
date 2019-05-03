<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择基线校正算法"></v-combobox>
      </v-flex>
      
      <v-flex text-xs-left md12 xs12 sm12 lg12>
        <air-pls v-if="isAIRPLS()" @paramUpdated="updateParams($event)"></air-pls>
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
import { AxiosResponse, AxiosError } from 'axios';
import { Algorithm, AIRPLS, POLYFIT } from '../common/Algorithm';
import RepositoryFactory from '../repositories/RepositoryFactory';
import store from '@/store';
import { Series } from '@/utils';

const DebackgroundRepository = RepositoryFactory.get('debackground');

@Component({
  components: {
    'air-pls': airPLS
  }
})
export default class DebackgroundSetting extends Vue {
  selected: Algorithm = AIRPLS;
  items: Array<Algorithm> = [
    AIRPLS,
    POLYFIT
  ];
  parameters?: any;
  
  isAIRPLS() {
    return this.selected === AIRPLS;
  }

  debackground() {
    DebackgroundRepository.get(this.selected.value, this.parameters)
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

  updateParams(event: any) {
    this.parameters = event;
  }
}
</script>

