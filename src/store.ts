import Vue from 'vue';
import Vuex from 'vuex';
import {Series} from '@/utils'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    spectraDeque: new Array<Series>(),
    undoDeque: new Array<Series>()
  },
  mutations: {
    enqueue(state, element: Series) {
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
      
    },
    clear(state) {
      state.spectraDeque.length = 0;
      state.undoDeque.length = 0;
    }
  },
  actions: {

  },
  getters: {
    targetSpectra: state => {
      return state.spectraDeque[state.spectraDeque.length - 1];
    },
  }
});
