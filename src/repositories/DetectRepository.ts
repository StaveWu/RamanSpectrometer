import Repository from '../repositories/Repository';

const resource = '/detects';
export default {
  detectComponents(targetName: string, targetSpectra: number[][], componentNames: string[]) {
    return Repository.post(`${resource}`, {
      name: targetName,
      data: targetSpectra,
      componentNames: componentNames
    });
  }
}