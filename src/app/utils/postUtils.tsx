import * as api from "@/app/api";

import { PostData } from "@/app/types/global";

export const fetchPosts = async (page: number) => {
  try {
    // Fetch posts using the API
    const fetchedPosts = await api.getPosts(page);
    return fetchedPosts;  // Return the fetched posts
  } catch (error: unknown) {
    // Handle error gracefully
    if (error instanceof Error) {
      console.error("Error fetching posts:", error.message);
    } else {
      console.error("Unknown error fetching posts");
    }
    return [];  // Return an empty array on error
  }
};

export const fetchPost = async (id: number) => {
  try {
    // Fetch a single post using the API
    const fetchedPost = await api.getPost(id);
    return fetchedPost;  // Return the fetched post
  } catch (error: unknown) {
    // Handle error gracefully
    if (error instanceof Error) {
      console.error("Error fetching post:", error.message);
    } else {
      console.error("Unknown error fetching post");
    }
    return null;  // Return null on error
  }
};

export const createPost = async (post: PostData) => {
  try {
    // Create a new post using the API
    const createdPost = await api.createPost(post);
    return createdPost;  // Return the created post
  } catch (error: unknown) {
    // Handle error gracefully
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Unknown error creating post");
    }
    return null;  // Return null on error
  }
};
