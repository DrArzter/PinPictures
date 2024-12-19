import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/app/types/global";

export default function logout(): Promise<AxiosResponse<ApiResponse<void>>> {
  return api.post<ApiResponse<void>>("/user/logout");
}
