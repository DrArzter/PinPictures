import api from './axiosApi';

export default async function getProfile(name: string) {
  try {
    const response = await api.get(
      `/user/profile/${name}`,
      {
        withCredentials: true
      }
    );
    return response.data.data;
  } catch (error) {
    if (error.response) {
      console.log('User is not');
      return null;
    } else {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}
