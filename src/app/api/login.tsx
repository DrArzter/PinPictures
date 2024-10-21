import api from './axiosApi';

export default async function login(username: string, password: string) {
  try {
    const response = await api.post(
      `/user/login`,
      {
        email: username,
        password: password
      },
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    alert('Error during login. Please try again.');
    throw error;
  }
}
