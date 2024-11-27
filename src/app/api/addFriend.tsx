import api from "./axiosApi";

export default async function addFriend(friendId: number, friendName: string) {
  try {
    const response = await api.post(
      `/friend/${encodeURIComponent(friendId)}`,
      { friendId, friendName },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
}
