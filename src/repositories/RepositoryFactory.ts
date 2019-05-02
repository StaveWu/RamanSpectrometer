import DenoiseRepository from '../repositories/DenoiseRepository'
import DebackgroundRepository from '../repositories/DebackgroundRepository'

interface Indexable {
  [index: string]: any;
}

const repositories: Indexable = {
  denoise: DenoiseRepository,
  debackground: DebackgroundRepository
}

export default {
  get(name: string) {
    return repositories[name];
  }
}