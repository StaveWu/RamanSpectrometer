import Repository from '../repositories/Repository';

const resource = '/components';
export default {
  loadComponents() {
    return Repository.get(`${resource}`);
  },
}