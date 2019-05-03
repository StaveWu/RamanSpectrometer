<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex text-xs-left md12 xs12 lg12>
        <v-combobox v-model="selected" :items="items" chips label="请选择去噪算法"></v-combobox>
      </v-flex>

      <v-flex xs12>
        <sg-filter v-if="isSG()" @paramUpdated="updateParams($event)"></sg-filter>
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
import { AxiosResponse, AxiosError } from 'axios';
import store from '@/store';
import { Series } from '@/utils';
import RepositoryFactory from '@/repositories/RepositoryFactory';
import { Algorithm, SG, DAE, WAVELET } from '../common/Algorithm'

const DenoiseRepository = RepositoryFactory.get('denoise');

@Component({
  components: {
    'sg-filter': SGFilter
  }
})
export default class DenoiseSetting extends Vue {
  selected: Algorithm = SG;
  items: Array<Algorithm> = [
    SG, 
    WAVELET, 
    DAE
  ];
  parameters?: any;
  
  isSG() {
    return this.selected === SG;
  }
  
  denoise() {
    DenoiseRepository.get(this.selected.value, this.parameters)
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


