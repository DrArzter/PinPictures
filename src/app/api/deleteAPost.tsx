import api from "./axiosApi";
import { ApiResponse } from "@/app/types/global";
import { AxiosResponse } from "axios";

export default async function deleteAPost(
  id: number
): Promise<AxiosResponse<ApiResponse<void>>> {
  return api.delete<ApiResponse<void>>(`/admin/post/${id}`);
}