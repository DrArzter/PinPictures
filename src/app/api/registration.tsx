import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Registration } from "@/app/types/global";

export default function registration(
  username: string,
  email: string,
  password: string
): Promise<AxiosResponse<ApiResponse<Registration>>> {
  return api.post<ApiResponse<Registration>>(
    `/user/registration`,
    { name: username, email, password },
    { withCredentials: true }
  );
}
