import api from "./axiosApi";
import { GetPostResponse, Post } from "@/app/types/global";

export default async function getPost(id: number): Promise<Post> {
  try {
    const response = await api.get<GetPostResponse>(`/post/id/${id}`);
    return response.data.post;
  } catch (error: unknown) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
