import axios from 'axios';
import api from './axiosApi';

export default async function logout(setUser) {
  try {
    const response = await api.post(
      '/user/logout',
      {},
      {
        withCredentials: true
      }
    );
    setUser(null);
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
