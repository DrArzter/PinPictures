import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Friend } from "@/app/types/global";

export default function getFriends(
  name: string
): Promise<AxiosResponse<ApiResponse<Friend[]>>> {
  return api.get<ApiResponse<Friend[]>>(
    `/friends/${encodeURIComponent(name)}`
  );
}
