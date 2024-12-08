import * as api from "@/app/api";
import { NewPost, Post as PostType } from "@/app/types/global";

export const fetchPosts = async (page: number): Promise<PostType[]> => {
  try {
    const fetchedPosts = await api.getPosts(page);
    return fetchedPosts;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.error("Unknown error fetching posts");
    }
    return [];
  }
};

export const fetchPost = async (id: number): Promise<PostType | null> => {
  try {
    const fetchedPost = await api.getPost(id);
    return fetchedPost;
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
    const response = await api.createPost(post);
    if (response.status === "success" && typeof response.data === "number") {
      return response.data;
    } else {
      console.error("Unexpected API response:", response);
      return null;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Unknown error creating post");
    }
    return null;
  }
};
