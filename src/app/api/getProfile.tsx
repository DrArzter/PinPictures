import api from "./axiosApi";

export default async function getProfile(name: string) {
  try {
    const response = await api.get(`/profile/${name}`, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      console.log("User is not found");
      return null;
    } else {
      console.error("Error fetching user:", error);
      return null;
    }
  }
}
