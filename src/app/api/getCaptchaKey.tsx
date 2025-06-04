import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/app/types/global";

interface CaptchaKeyResponse {
  sitekey: string;
}

export default function getCaptchaKey(): Promise<AxiosResponse<ApiResponse<CaptchaKeyResponse>>> {
  return api.get<ApiResponse<CaptchaKeyResponse>>(`/user/registration`);
}
