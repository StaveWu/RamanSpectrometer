import Repository from './Repository';

const resource = '/debackgrounds';
export default {
  airpls(data: Array<number>|Array<Array<number>>, lambda: number) {
    return Repository.post(`${resource}/airpls`, {
      data: data,
      lambda: lambda
    });
  },
  polyfit(data: Array<number>|Array<Array<number>>, lambda: number) {
    return Repository.post(`${resource}/polyfit`, {
      data: data
    });
  }
}

