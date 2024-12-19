import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/app/types/global";

export default function addFriend(
  friendId: number,
  friendName: string
): Promise<AxiosResponse<ApiResponse<string>>> {
  return api.post<ApiResponse<string>>(
    `/friend/${encodeURIComponent(friendId)}`,
    { friendId, friendName }
  );
}
