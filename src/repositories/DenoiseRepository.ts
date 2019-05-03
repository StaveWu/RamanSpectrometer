import Repository from './Repository';

const resource = '/denoises'
export default {
  get(method: string, data?: any) {
    return Repository.post(`${resource}/${method}`, data);
  },
}