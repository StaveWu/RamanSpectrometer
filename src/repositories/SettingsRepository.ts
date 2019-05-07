import Repository from '../repositories/Repository';

const resource = '/settings';
export default {
  set(what: string, data: any) {
    return Repository.put(`${resource}/${what}`, data);
  }
}