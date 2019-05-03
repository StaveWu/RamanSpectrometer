import Repository from './Repository';

const resource = '/debackgrounds';
export default {
  get(method: string, data?: any) {
    return Repository.post(`${resource}/${method}`, data);
  },
}

