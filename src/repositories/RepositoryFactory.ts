import DenoiseRepository from '../repositories/DenoiseRepository'
import DebackgroundRepository from '../repositories/DebackgroundRepository'
import ConventionalRepository from '../repositories/ConventionalRepository'

interface Indexable {
  [index: string]: any;
}

const repositories: Indexable = {
  denoise: DenoiseRepository,
  debackground: DebackgroundRepository,
  conventional: ConventionalRepository
}

export default {
  get(name: string) {
    return repositories[name];
  }
}