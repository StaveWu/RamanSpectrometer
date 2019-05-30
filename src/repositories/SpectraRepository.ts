import Repository from '../repositories/Repository';
import { Spectrum } from '@/utils';

const resource = '/spectra';
export default {
  loadSpectra() {
    return Repository.get(`${resource}`, {
      params: {
        count: 8
      }
    });
  },

  addSpectrum(spec: Spectrum) {
    return Repository.post(`${resource}`, {
      id: spec.id,
      name: spec.name,
      data: spec.data
    });
  },

  tagSpectrum(targetSpectraName: string, componentName: string, probability: number) {
    return Repository.patch(`${resource}/${targetSpectraName}`, {
      componentName: componentName,
      probability: probability
    });
  }
}