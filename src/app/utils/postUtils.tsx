import * as api from "@/app/api";

export const fetchPosts = async (page: number) => {
  try {
    const fetchedPosts = await api.getPosts(page);
    return fetchedPosts.map((post: Post) => ({
      ...post,
      comments: post.comments || [],
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};