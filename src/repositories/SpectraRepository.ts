import Repository from '../repositories/Repository';
import { SpectrumDO, DetectResult, ComponentDO } from '@/utils';

const resource = '/spectra';
export default {
  loadSpectra() {
    return Repository.get(`${resource}`, {
      params: {
        count: 8
      }
    });
  },

  addSpectrum(spec: SpectrumDO) {
    return Repository.post(`${resource}`, spec.toJson())
      .then(resp => {
        spec.id = resp.data.id;
      });
  },

  tagSpectrum(id: number, detectResult: DetectResult) {
    return Repository.patch(`${resource}/${id}`, {
      id: detectResult.id,
      probability: detectResult.probability
    });
  },

  detectComponents(targetSpec: SpectrumDO, compIds: number[]) {
    return Repository.post(`${resource}/${targetSpec.id}/components`, {
        name: targetSpec.name,
        data: targetSpec.data,
        compIds: compIds
      })
      .then(resp => {
        let results: DetectResult[] = [];
        resp.data.results.forEach((res: any) => {
          results.push(DetectResult.fromJson(res));
        });
        return results;
      });
  },

  batchDetectComponents(targetSpectra: SpectrumDO[], components: ComponentDO[]) {
    let specIds = targetSpectra.map(spec => spec.id);
    let compIds = components.map(comp => comp.id);
    Repository.post(`${resource}/components`, {
      specIds: specIds,
      compIds: compIds
    });
  }
}