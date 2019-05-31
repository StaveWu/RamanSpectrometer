import Repository from './Repository';
import { SpectrumDO } from '@/utils';

const resource = '/debackgrounds';
export default {
  get(method: string, spec: SpectrumDO, params: any) {
    return Repository.post(`${resource}/${method}`, {
      name: spec.name,
      data: spec.data,
      params: params
    });
  },
}

