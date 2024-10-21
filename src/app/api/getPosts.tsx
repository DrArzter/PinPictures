import axios from 'axios';
import config from "./config";

export default async function getPosts(page: number) {
  try {
    console.log('page', page);
    const response = await axios.get(
      `${config.apiUrl}/post/${page}`
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}
