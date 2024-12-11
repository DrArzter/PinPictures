import axios from "axios";
import { ApiResponse } from "@/app/types/global";
import { AxiosResponse } from "axios";

export default async function deleteAPost(
  id: number
): Promise<AxiosResponse<ApiResponse<void>>> {
  return axios.delete<ApiResponse<void>>(`/admin/post/${id}`, {
    withCredentials: true,
  });
}
