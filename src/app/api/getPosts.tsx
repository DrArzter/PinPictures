// src/app/api/getPosts.ts

import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Post as PostType } from "@/app/types/global";

export default function getPosts(page: number): Promise<AxiosResponse<ApiResponse<PostType[]>>> {
  return api.get<ApiResponse<PostType[]>>(`/post/page/${page}`);
}
