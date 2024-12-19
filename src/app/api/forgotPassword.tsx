import { AxiosResponse } from "axios";
import { ApiResponse } from "@/app/types/global";
import api from "./axiosApi";

export default function forgotPassword(
  email: string
): Promise<AxiosResponse<ApiResponse<null>>> {
  return api.post<ApiResponse<null>>(`/forgot-password`, { email });
}
