import api from "./axiosApi";

export default async function updateUser(formData: FormData) {
  try {
    const response = await api.patch(`/user`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    alert("Error during login. Please try again.");
    throw error;
  }
}
