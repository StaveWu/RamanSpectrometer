import Repository from './Repository';
import { SpectrumDO } from '@/models';

const resource = '/conventionals'
export default {
  get(method: string, spec: SpectrumDO, params: any) {
    return Repository.post(`${resource}/${method}`, {
        name: spec.name,
        data: spec.data,
        params: params,
      })
      .then(resp => {
        let res = SpectrumDO.fromJson(resp.data);
        res.id = spec.id;
        return res;
      });
  },
}