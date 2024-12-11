// postUtils.tsx
import * as api from "@/app/api";
import {
  NewPost,
  Post as PostType,
  FullPost as FullPostType,
  ApiResponse,
} from "@/app/types/global";
import { AxiosResponse } from "axios";

export const fetchPosts = async (page: number): Promise<PostType[]> => {
  try {
    const response: AxiosResponse<ApiResponse<PostType[]>> = await api.getPosts(
      page
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.error("Unknown error fetching posts");
    }
    return [];
  }
};

export const fetchPost = async (id: number): Promise<FullPostType | null> => {
  try {
    const response: AxiosResponse<ApiResponse<FullPostType>> =
      await api.getPost(id);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching post:", error.message);
    } else {
      console.error("Unknown error fetching post");
    }
    return null;
  }
};

export const createPost = async (post: NewPost): Promise<number | null> => {
  try {
    const response: AxiosResponse<ApiResponse<string>> = await api.createPost(
      post
    );
    if (response.data.status === "success") {
      const postId = Number(response.data.data);
      if (!isNaN(postId)) {
        return postId;
      }
    }
    console.error("Unexpected API response:", response);
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Unknown error creating post");
    }
    return null;
  }
};
