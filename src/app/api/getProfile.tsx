import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, ProfileData } from "@/app/types/global";

export default function getProfile(
  name: string
): Promise<AxiosResponse<ApiResponse<ProfileData>>> {
  return api.get<ApiResponse<ProfileData>>(
    `/profile/${encodeURIComponent(name)}`
  );
}
