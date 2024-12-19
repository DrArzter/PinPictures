import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, AdminShortUser } from "@/app/types/global";

export default function getAUsers(
  searchTerm: string
): Promise<AxiosResponse<ApiResponse<AdminShortUser[]>>> {
  return api.get<ApiResponse<AdminShortUser[]>>(
    `/admin/users/${encodeURIComponent(searchTerm)}`
  );
}
