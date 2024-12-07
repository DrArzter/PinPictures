import api from "./axiosApi";

export default async function getAUsers(searchTerm: string) {
    const response = await api.get(`/admin/users/${searchTerm}`,
         {
        withCredentials: true
    });
    return response.data;
};