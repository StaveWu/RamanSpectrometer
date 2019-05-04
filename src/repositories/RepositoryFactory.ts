import DenoiseRepository from '../repositories/DenoiseRepository'
import DebackgroundRepository from '../repositories/DebackgroundRepository'
import ConventionalRepository from '../repositories/ConventionalRepository'
import ComponentRepository from './ComponentRepository';
import DetectRepository from './DetectRepository';

interface Indexable {
  [index: string]: any;
}

const repositories: Indexable = {
  denoise: DenoiseRepository,
  debackground: DebackgroundRepository,
  conventional: ConventionalRepository,
  component: ComponentRepository,
  detect: DetectRepository
}

export default {
  get(name: string) {
    return repositories[name];
  }
}