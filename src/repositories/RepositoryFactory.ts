import DenoiseRepository from '../repositories/DenoiseRepository'
import DebackgroundRepository from '../repositories/DebackgroundRepository'
import ConventionalRepository from '../repositories/ConventionalRepository'
import ComponentRepository from './ComponentRepository';
import DetectRepository from './DetectRepository';
import SpectraRepository from './SpectraRepository';
import SettingsRepository from './SettingsRepository';

interface Indexable {
  [index: string]: any;
}

const repositories: Indexable = {
  denoise: DenoiseRepository,
  debackground: DebackgroundRepository,
  conventional: ConventionalRepository,
  component: ComponentRepository,
  detect: DetectRepository,
  spectra: SpectraRepository,
  settings: SettingsRepository
}

export default {
  get(name: string) {
    return repositories[name];
  }
}