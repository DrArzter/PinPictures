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
    console.error('Error fetching user:', error);
    return null;
  }
}
