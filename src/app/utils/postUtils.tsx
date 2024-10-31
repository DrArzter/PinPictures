// postUtils.ts
import * as api from "@/app/api";

export const fetchPosts = async (page: number) => {
  try {
    const fetchedPosts = await api.getPosts(page);
    return fetchedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return [];
  }
};

export const fetchPost = async (id: number) => {
  try {
    const fetchedPost = await api.getPost(id);
    return fetchedPost;
  } catch (error) {
    console.error("Error fetching post:", error.message);
    return null;
  }
};

export const createPost = async (post: Post) => {
  try {
    const createdPost = await api.createPost(post);
    return createdPost;
  } catch (error) {
    console.error("Error creating post:", error.message);
    return null;
  }
};
