import Repository from '../repositories/Repository';
import {Pipeline} from '../models'

const resource = '/settings';
const set = (what: string, data: any) => {
  return Repository.put(`${resource}/${what}`, data);
}
const get = (what: string) =>{
  return Repository.get(`${resource}/${what}`);
}

export default {
  setWavenumbersRange(start: number, end: number) {
    return set('wavenumbersrange', {
      start: start,
      end: end
    });
  },
  getWavenumbersRange() {
    return get('wavenumbersrange');
  },
  setPipeline(pipeline: Pipeline[]) {
    return set('pipeline', pipeline);
  },
  getPipeline() {
    return get('pipeline');
  }
}