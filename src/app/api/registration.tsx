import axios from "axios";
import config from './config';

export default async function registration(username: string, email: string, password: string) {

  try {
    const response = await axios.post(`${config.apiUrl}/user/registration`, {
      name: username,
      email: email,
      password: password
    },
      {
        withCredentials: true
      }
    );
    return response.data.user;
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Error during registration. Please try again.');
    throw error;
  }
}
