import Axios, { AxiosResponse } from 'axios';
import { UserData } from '@/userdata';

const network = new UserData('network', {address: "47.96.136.172", port: "80"});

// const baseDomain = 'http://127.0.0.1:5000';
// const baseDomain = 'https://raman-spectrometer.herokuapp.com';

const baseDomain = `http://${network.get('address')}:${network.get('port')}`;
const baseURL = `${baseDomain}/api/v1`;

export default Axios.create({
  baseURL
});
