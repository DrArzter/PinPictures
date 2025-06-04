import api from "./axiosApi";
import { ApiResponse } from "@/app/types/global";
import { AxiosResponse } from "axios";

export default async function deleteAComment(
  id: number,
  commentId: number
): Promise<AxiosResponse<ApiResponse<void>>> {
  return api.delete<ApiResponse<void>>(`/post/id/${id}/comment/${commentId}`);
}