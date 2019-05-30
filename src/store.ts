import Vue from 'vue';
import Vuex from 'vuex';
import {SpectrumDO} from '@/utils'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    spectraDeque: new Array<SpectrumDO>(),
    undoDeque: new Array<SpectrumDO>(),
    dark: false,
  },
  mutations: {
    enqueue(state, element: SpectrumDO) {
      state.spectraDeque.push(element);
    },
    dequeue(state) {
      let poped = state.spectraDeque.pop();
      if (poped === undefined) {
        console.log('nothing to dequeue');
      } else {
        state.undoDeque.push(poped);
      }
    },
    undo(state) {
      let poped = state.undoDeque.pop();
      if (poped === undefined) {
        console.log('nothing to undo');
      } else {
        state.spectraDeque.splice(0, 1);
        state.spectraDeque.push(poped);
      }
    },
    clear(state) {
      state.spectraDeque.length = 0;
      state.undoDeque.length = 0;
    },
    setDark(state, enable: boolean) {
      state.dark = enable;
    },
  },
  actions: {

  },
  getters: {
    targetSpectra: state => {
      return state.spectraDeque[state.spectraDeque.length - 1];
    },
    dark(state) {
      return state.dark;
    }
  }
});
