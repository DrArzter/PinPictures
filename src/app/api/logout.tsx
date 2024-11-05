import axios from "axios";
import api from "./axiosApi";

export default async function logout(setUser) {
  try {
    const response = await api.post(
      "/user/logout",
      {},
      {
        withCredentials: true,
      }
    );
    setUser(null);
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
