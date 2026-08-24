import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CreateReportRequest, CreateReportResponse } from './types';

// 신고 접수 요청
export const createReport = async (body: CreateReportRequest): Promise<CreateReportResponse> => {
  const response = await axiosInstance.post<CreateReportResponse>('/v1/user/reports', body);
  return response.data;
};
