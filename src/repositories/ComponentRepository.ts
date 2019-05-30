import Repository from '../repositories/Repository';
import {ComponentDO, SpectrumDO} from '@/utils';

const resource = '/components';
export default {
  loadComponents() {
    return Repository.get(`${resource}`);
  },
  addComponent(comp: ComponentDO) {
    return Repository.post(`${resource}`, comp.toJson());
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
    console.log(comp.id);
    return Repository.patch(`${resource}/${comp.id}`, comp.toJson());
  }
}