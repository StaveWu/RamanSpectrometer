import Repository from '../repositories/Repository';

const resource = '/spectras';
export default {
  loadSpectras() {
    return Repository.get(`${resource}`, {
      params: {
        count: 8
      }
    });
  },

  addSpectra(name: string, data: number[][]) {
    return Repository.post(`${resource}`, {
      name: name,
      data: data
    });
  },

  tagSpectra(targetSpectraName: string, componentNames: string[]) {
    return Repository.patch(`${resource}/${targetSpectraName}`, {
      componentNames: componentNames
    });
  }
}