import api from "./axiosApi";

export default async function registration(
  username: string,
  email: string,
  password: string
) {
  try {
    const response = await api.post(
      `/user/registration`,
      {
        name: username,
        email: email,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Error during registration. Please try again.");
    throw error;
  }
}
