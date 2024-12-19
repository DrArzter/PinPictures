import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Like } from "@/app/types/global";

export default function likePost(
  id: number
): Promise<AxiosResponse<ApiResponse<Like>>> {
  return api.post<ApiResponse<Like>>(
    `/like/${id}`,
    { id }
  );
}
