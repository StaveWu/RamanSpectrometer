import Repository from '../repositories/Repository';

const resource = '/spectra';
export default {
  loadSpectra() {
    return Repository.get(`${resource}`, {
      params: {
        count: 8
      }
    });
  },

  addSpectrum(name: string, data: number[][]) {
    return Repository.post(`${resource}`, {
      name: name,
      data: data
    });
  },

  tagSpectrum(targetSpectraName: string, componentName: string, probability: number) {
    return Repository.patch(`${resource}/${targetSpectraName}`, {
      componentName: componentName,
      probability: probability
    });
  }
}