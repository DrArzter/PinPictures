import api from "./axiosApi";

export default async function getAllUsers() {
  try {
    const response = await api.get(
      `/admin/summary`,
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    return null;
  }
}
