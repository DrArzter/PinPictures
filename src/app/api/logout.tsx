import api from "./axiosApi";
import { clientSelfUser } from "@/app/types/global"; // Предполагается, что интерфейс User определен здесь
import { Dispatch, SetStateAction } from "react";

export default async function logout(setUser: Dispatch<SetStateAction<clientSelfUser | null>>) {
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
