export interface Algorithm {
  text: string,
  value: string
}

const SG: Algorithm = {text: 'S-G滤波', value: 'sgfilter'};
const DAE: Algorithm = {text: '卷积去噪自编码器', value: 'dae'};
const WAVELET: Algorithm = {text: '小波变换', value: 'wavelet'};
const AIRPLS: Algorithm = {text: 'airPLS', value: 'airpls'};
const POLYFIT: Algorithm = {text: '多项式拟合', value: 'polyfit'};
const SVD_MAD: Algorithm = {text: '奇异值分解-中位数绝对偏差', value: 'svd-mad'};
const MINMAX_SCALE: Algorithm = {text: '归一化', value: 'minmax-scale'};
const SCALE: Algorithm = {text: '标准化', value: 'scale'};

export {
  SG,
  DAE,
  WAVELET,
  AIRPLS,
  POLYFIT,
  SVD_MAD,
  MINMAX_SCALE,
  SCALE
}