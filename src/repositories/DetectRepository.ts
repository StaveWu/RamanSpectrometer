import Repository from '../repositories/Repository';
import { SpectrumDO, DetectResult } from '@/utils';

const resource = '/spectra';
export default {
  batchDetectComponents(targetSpectras: Array<SpectrumDO>, compNames: string[]) {
    return Repository.post(`${resource}/batch`, {
      targetSpectras,
      componentNames: compNames
    });
  }
}