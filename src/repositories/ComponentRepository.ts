import Repository from '../repositories/Repository';
import {ComponentDO} from '@/utils';

const resource = '/components';
export default {
  loadComponents() {
    return Repository.get(`${resource}`);
  },
  addComponent(comp: ComponentDO) {
    return Repository.post(`${resource}`, {
      name: comp.name,
      formula: comp.formula,
      owned_spectra: comp.owned_spectra
    });
  },
  removeComponent(id: number) {
    return Repository.delete(`${resource}/${id}`);
  },
  searchComponent(id: number) {
    return Repository.get(`${resource}`, {
      params: {
        id: id
      }
    });
  },
  updateComponent(comp: ComponentDO) {
    return Repository.patch(`${resource}/${comp.id}`, {
      name: comp.name,
      owned_spectra: comp.owned_spectra,
      formula: comp.formula
    });
  }
}