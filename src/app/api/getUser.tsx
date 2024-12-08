import api from "./axiosApi";
import { AxiosError } from "axios";

export default async function getUser() {
  try {
    const response = await api.get(`/user`, {
      withCredentials: true,
    });
    if (response.status == 444) {
      console.log("Suck.");
      return response.data.data;
    }
    return response.data.data;
  } catch (error: unknown) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "No token provided"
    ) {
      console.log("User is not authenticated, no token provided.");
      return null;
    } else {
      console.error("Error fetching user:", error);
      return null;
    }
  }
}
