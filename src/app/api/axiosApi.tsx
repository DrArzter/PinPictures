import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: `${config.apiUrl}/api`,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.resolve(error.response);
  }
);

export default api;
