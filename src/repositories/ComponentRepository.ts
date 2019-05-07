import Repository from '../repositories/Repository';

const resource = '/components';
export default {
  loadComponents() {
    return Repository.get(`${resource}`);
  },
  addComponent(name: string, data: number[][]) {
    return Repository.post(`${resource}`, {
      name: name,
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
  }
}