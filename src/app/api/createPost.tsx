// createPost.ts
import api from "./axiosApi";
import { ApiResponse } from "@/app/types/global";
import { AxiosResponse } from "axios";

export interface NewPostRequest {
  name: string;
  description: string;
  images: File[];
}

export default async function createPost(
  post: NewPostRequest
): Promise<AxiosResponse<ApiResponse<string>>> {
  const formData = new FormData();

  post.images.forEach((image, index: number) => {
    formData.append(`image[${index}]`, image);
  });

  formData.append("name", post.name);
  formData.append("description", post.description);

  return api.post<ApiResponse<string>>("/post", formData, {
    withCredentials: true,
  });
}
