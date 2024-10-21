import axios from 'axios';

import config from './config';

const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    /*if (error.response && error.response.status) {
      return Promise.resolve(error);
    }*/
    return Promise.reject(error);
  }
);

export default api;
