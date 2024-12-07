import api from "./axiosApi";

export default async function getAUserChats(searchTerm: string) {
    const response = await api.get(`/admin/user/chats/${searchTerm}`,
         {
        withCredentials: true
    });
    return response.data;
};