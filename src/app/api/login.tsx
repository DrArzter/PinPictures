import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Login } from "@/app/types/global";

export default function login(
  username: string,
  password: string
): Promise<AxiosResponse<ApiResponse<Login>>> {
  return api.post<ApiResponse<Login>>(
    `/user/login`,
    { email: username, password },
    { withCredentials: true }
  );
}
