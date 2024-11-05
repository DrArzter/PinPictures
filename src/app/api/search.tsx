import api from "./axiosApi";

export default async function search(term: string) {
  try {
    const response = await api.get(`/search/term/${term}`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
