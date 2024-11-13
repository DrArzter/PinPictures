import api from "./axiosApi";
import { User } from "@/app/types/global";
import { AxiosError } from "axios";

export default async function getUser(): Promise<User | null> {
  try {
    const response = await api.get<{ data: User }>(`/user`, {
      withCredentials: true,
    });
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
