import api from "./axiosApi";
import { NewPost, ApiResponse } from "@/app/types/global";
import { AxiosError } from "axios";

export default async function createPost(
  post: NewPost
): Promise<ApiResponse<NewPost>> {
  try {
    const formData = new FormData();

    post.images.forEach((image, index: number) => {
      formData.append(`image[${index}]`, image);
    });

    formData.append("name", post.name);
    formData.append("description", post.description);

    const response = await api.post("/post", formData, {
      withCredentials: true,
    });

    return {
      status: "success",
      message: "Post created successfully",
      data: response.data
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      console.error(
        "Error creating post:",
        error.response.data || error.message
      );

      return {
        status: "error",
        message:
          error.response.data?.message ||
          "An error occurred while creating the post",
        data: {} as NewPost,
      };
    } else {
      console.error("Unexpected error:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: {} as NewPost,
      };
    }
  }
}
