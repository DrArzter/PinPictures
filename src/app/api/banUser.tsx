import api from "./axiosApi";

export default async function banUser(id: number) {
  const response = await api.put(`/admin/user/ban/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
