import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, AdminShortUser } from "@/app/types/global";

export default function banUser(
  id: number
): Promise<AxiosResponse<ApiResponse<AdminShortUser | null>>> {
  return api.put<ApiResponse<AdminShortUser | null>>(
    `/admin/user/ban/${id}`,
    {},
    { withCredentials: true }
  );
}
