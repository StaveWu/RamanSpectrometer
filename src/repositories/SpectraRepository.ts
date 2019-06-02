import Repository from '../repositories/Repository';
import { SpectrumDO } from '@/utils';

const resource = '/spectra';
export default {
  loadSpectra() {
    return Repository.get(`${resource}`, {
      params: {
        count: 8
      }
    });
  },

  addSpectrum(spec: SpectrumDO) {
    return Repository.post(`${resource}`, spec.toJson())
      .then(resp => {
        spec.id = resp.data.id;
      });
  },

  tagSpectrum(targetSpectraName: string, componentName: string, probability: number) {
    return Repository.patch(`${resource}/${targetSpectraName}`, {
      componentName: componentName,
      probability: probability
    });
  }
}