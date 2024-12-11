import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { AdminChat, ApiResponse } from "@/app/types/global";

export default function getAUserChats(
  searchTerm: string
): Promise<AxiosResponse<ApiResponse<AdminChat[]>>> {
  return api.get<ApiResponse<AdminChat[]>>(
    `/admin/user/chats/${encodeURIComponent(searchTerm)}`,
    { withCredentials: true }
  );
}
