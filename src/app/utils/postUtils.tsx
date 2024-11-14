// utils/postUtils.ts
import * as api from "@/app/api";

import { PostData, Post } from "@/app/types/global";

export const fetchPosts = async (page: number): Promise<Post[]> => {
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

export const fetchPost = async (id: number): Promise<Post | null> => {
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

export const createPost = async (post: PostData): Promise<Post | null> => {
  try {
    const createdPost = await api.createPost(post);
    return createdPost;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Unknown error creating post");
    }
    return null;
  }
};
