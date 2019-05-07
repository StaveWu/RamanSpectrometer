import Repository from './Repository';

const resource = '/denoises'
export default {
  get(method: string, name: string, data: number[][], params: any) {
    return Repository.post(`${resource}/${method}`, {
      name: name,
      data: data,
      params: params
    });
  },
}