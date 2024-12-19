import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/app/types/global";

export default function uploadComment(
  id: number,
  comment: string
): Promise<AxiosResponse<ApiResponse<Comment>>> {
  return api.post<ApiResponse<Comment>>(`/comment/${id}`, { comment });
}
