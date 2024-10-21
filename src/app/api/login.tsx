import axios from "axios";
import config from './config';

export default async function login(username: string, password: string) {
  try {
    const response = await axios.post(
      `${config.apiUrl}/user/login`,
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
