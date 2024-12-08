import api from "./axiosApi";

export default async function getPost(id: number) {
  try {
    const response = await api.get(`/post/id/${id}`);
    return response.data.post;
  } catch (error: unknown) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
