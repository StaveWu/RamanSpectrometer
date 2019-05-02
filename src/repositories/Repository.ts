import Axios, { AxiosResponse } from 'axios';

const baseDomain = 'http://127.0.0.1:5000';
const baseURL = `${baseDomain}/api/v1`;

export default Axios.create({
  baseURL
});
