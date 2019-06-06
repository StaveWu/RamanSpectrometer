import Vue from 'vue';
import Vuex from 'vuex';
import { SpectrumDO } from '@/models'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    undoDeque: new Array<SpectrumDO>(),
    dark: false,

    targetSpectrum: SpectrumDO.EMPTY,
    candidateSpectrum: SpectrumDO.EMPTY,

    temp: SpectrumDO.EMPTY
  },
  mutations: {
    clear(state) {
      state.targetSpectrum = SpectrumDO.EMPTY;
      state.candidateSpectrum = SpectrumDO.EMPTY;
    },
    setTargetSpectrum(state, spec: SpectrumDO) {
      // clear
      state.targetSpectrum = SpectrumDO.EMPTY;
      state.candidateSpectrum = SpectrumDO.EMPTY;
      state.targetSpectrum = spec;
    },
    setCandidateSpectrum(state, spec: SpectrumDO) {
      state.candidateSpectrum = spec;
    },
    candidateToTarget(state) {
      if (state.candidateSpectrum === SpectrumDO.EMPTY) {
        return;
      }
      state.undoDeque.push(state.targetSpectrum);
      state.targetSpectrum = state.candidateSpectrum;
      state.candidateSpectrum = SpectrumDO.EMPTY;
    },
    undo(state) {
      let poped = state.undoDeque.pop();
      if (poped === undefined) {
        console.log('nothing to undo');
      } else {
        state.targetSpectrum = poped;
        state.candidateSpectrum = SpectrumDO.EMPTY;
      }
    },
    setDark(state, enable: boolean) {
      state.dark = enable;
    },
  },
  actions: {

  },
  getters: {
    spectra: state => {
      let res = [state.targetSpectrum, state.candidateSpectrum];
      res = res.filter((spec: SpectrumDO) => spec !== SpectrumDO.EMPTY);
      return res;
    },
    dark(state) {
      return state.dark;
    }
  }
});
