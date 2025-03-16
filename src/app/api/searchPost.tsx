import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, Search } from "@/app/types/global";


export default async function searchPost(
    query: string
): Promise<AxiosResponse<ApiResponse<Search>>> {
    return api.get<ApiResponse<Search>>(`/search/${query}`);
}