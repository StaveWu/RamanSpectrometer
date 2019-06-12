import Vue from 'vue';
import Vuex from 'vuex';
import { SpectrumDO } from '@/models';
import { UserData } from '@/userdata';

const preference = new UserData('user-preferences', {dark: false});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dark: preference.get('dark'),

    undoDeque: new Array<SpectrumDO>(),
    targetSpectrum: SpectrumDO.EMPTY,
    candidateSpectrum: SpectrumDO.EMPTY,
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
      preference.set('dark', enable);
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
