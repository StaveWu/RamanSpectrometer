import Repository from '../repositories/Repository';
import { Series } from '@/utils';

const resource = '/detects';
export default {
  detectComponents(targetName: string, targetSpectra: number[][], componentNames: string[]) {
    return Repository.post(`${resource}`, {
      name: targetName,
      data: targetSpectra,
      componentNames: componentNames
    });
  },
  batchDetectComponents(targetSpectras: Array<Series>, compNames: string[]) {
    return Repository.post(`${resource}/batch`, {
      targetSpectras,
      componentNames: compNames
    });
  }
}