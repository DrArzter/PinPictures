import api from "./axiosApi";

export default async function uploadComment(
    id: number,
    comment: string
) {
    try {
        const response = await api.post(
            `/post/comment/${id}`,
            {
                comment: comment,
            },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading comment:", error);
        throw error;
    }
}