import api from "./axiosApi";
import { AxiosResponse } from "axios";
import { ApiResponse, SummaryData } from "@/app/types/global";

export default function getSummary(): Promise<
  AxiosResponse<ApiResponse<SummaryData>>
> {
  return api.get<ApiResponse<SummaryData>>(`/admin/summary`);
}
