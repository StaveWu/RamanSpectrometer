import Repository from '../repositories/Repository';

const resource = '/components';
export default {
  loadComponents() {
    return Repository.get(`${resource}`);
  },
  addComponent(name: string, formula: string, data: number[][]) {
    return Repository.post(`${resource}`, {
      name: name,
      formula: formula,
      data: data
    });
  },
  removeComponent(name: string) {
    return Repository.delete(`${resource}/${name}`);
  },
  searchComponent(name: string) {
    return Repository.get(`${resource}`, {
      params: {
        name: name
      }
    });
  },
  updateComponent(name: string, formula: string, data: number[][]) {
    return Repository.patch(`${resource}/${name}`, {
      formula: formula,
      data: data
    });
  }
}