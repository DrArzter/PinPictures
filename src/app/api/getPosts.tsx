import api from './axiosApi';

export default async function getPosts(page: number) {
  try {
    const response = await api.get(
      `/post/${page}`
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}
