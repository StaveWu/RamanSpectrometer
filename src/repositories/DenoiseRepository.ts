import Repository from './Repository';

const resource = '/denoises'
export default {
  sgFilter(data: Array<number>|Array<Array<number>>, order: number, windowLength: number) {
    return Repository.post(`${resource}/sgfilter`, {
      data: data,
      order: order,
      windowLength: windowLength
    });
  },
  dae(data: Array<number>|Array<Array<number>>) {
    return Repository.post(`${resource}/dae`, {
      data: data
    });
  },
  wavelet(data: Array<number>|Array<Array<number>>) {
    return Repository.post(`${resource}/wavelet`, {
      data: data
    });
  }
}