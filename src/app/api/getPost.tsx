// src/app/api/getPost.ts

import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, FullPost } from "@/app/types/global";

export default function getPost(
  id: number
): Promise<AxiosResponse<ApiResponse<FullPost>>> {
  return api.get<ApiResponse<FullPost>>(`/post/id/${id}`);
}
