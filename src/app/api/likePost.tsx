import api from "./axiosApi";

export default async function likePost(id: number) {
  try {
    const response = await api.post(
      `/like/${id}`,
      {
        id: id,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}
