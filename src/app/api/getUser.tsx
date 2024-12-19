import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, ClientSelfUser } from "@/app/types/global";

export default function getUser(): Promise<
  AxiosResponse<ApiResponse<ClientSelfUser>>
> {
  return api.get<ApiResponse<ClientSelfUser>>(`/user`);
}
