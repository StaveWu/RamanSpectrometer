import Repository from '../repositories/Repository';
import { SpectrumDO } from '@/utils';

const resource = '/detects';
export default {
  detectComponents(targetName: string, targetSpectra: number[][], componentNames: string[]) {
    return Repository.post(`${resource}`, {
      name: targetName,
      data: targetSpectra,
      componentNames: componentNames
    });
  },
  batchDetectComponents(targetSpectras: Array<SpectrumDO>, compNames: string[]) {
    return Repository.post(`${resource}/batch`, {
      targetSpectras,
      componentNames: compNames
    });
  }
}