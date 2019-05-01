import Vue from 'vue';
import Vuex from 'vuex';
import {Series} from '@/utils'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    spectra: new Series('', [])
  },
  mutations: {

  },
  actions: {

  },
});
