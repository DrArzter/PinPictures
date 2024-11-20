import api from "./axiosApi";

export default async function getFriends(name: string) {
    try {
        const response = await api.get(`/user/friends/${name}`);
        return response.data.friends;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}