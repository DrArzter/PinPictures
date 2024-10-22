import api from './axiosApi';

export default async function getUser() {
  try {
    const response = await api.get(
      `/user`,
      {
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 401 && error.response.data.message === "No token provided") {
      console.log('User is not authenticated, no token provided.');
      return null;
    } else {
      // Логируем остальные ошибки
      console.error('Error fetching user:', error);
      return null;
    }
  }
}
