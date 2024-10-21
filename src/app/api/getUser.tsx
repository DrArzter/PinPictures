import axios from 'axios';
import config from "./config";

export default async function getUser() {
  try {
    const response = await axios.get(
      `${config.apiUrl}/user`,
      {
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
