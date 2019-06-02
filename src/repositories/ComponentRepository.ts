import Repository from '../repositories/Repository';
import { ComponentDO, ComponentDTO, ModelDTO } from '@/utils';
import axios from 'axios';

const resource = '/components';

function loadComponentDTOs() {
  return Repository.get(`${resource}`);
}

function loadModelDTOs() {
  return Repository.get('models');
}

function addComponentDTO(compdto: ComponentDTO) {
  return Repository.post(`${resource}`, compdto.toJson());
}

function deleteComponentDTO(id: number) {
  return Repository.delete(`${resource}/${id}`);
}

function updateComponentDTO(comp: ComponentDTO) {
  return Repository.patch(`${resource}/${comp.id}`, comp.toJson());
}


export default {
  loadComponents() {
    return axios.all([loadComponentDTOs(), loadModelDTOs()])
      .then(axios.spread((compResp, modelResp) => {
        let compdtos: Array<ComponentDTO> = [];
        compResp.data.components.forEach((comp: any) => {
          compdtos.push(ComponentDTO.fromJson(comp));
        });

        let modeldtos: Array<ModelDTO> = [];
        modelResp.data.models.forEach((model: any) => {
          modeldtos.push(ModelDTO.fromJson(model));
        });

        let comps: Array<ComponentDO> = [];
        // TODO: assemble comps
        return comps;
      }))
  },
  addComponent(comp: ComponentDO) {
    return addComponentDTO(comp.toDTO())
      .then(resp => {
        // access id
        comp.id = resp.data.id;
      });
  },
  removeComponent(id: number) {
    return deleteComponentDTO(id);
  },
  updateComponent(comp: ComponentDO) {
    return updateComponentDTO(comp.toDTO());
  },
  createModel(id: number) {
    return Repository.post(`${resource}/${id}/model`);
  },
  tuneModel(id: number) {
    return Repository.put(`${resource}/${id}/model`);
  },
  getModels() {
    return loadModelDTOs();
  }
}