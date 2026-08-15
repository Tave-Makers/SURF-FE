import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { DashboardDateRangeParams, DashboardResponse } from './types';

export async function getDashboard(params: DashboardDateRangeParams) {
  const response = await axiosInstance.get<DashboardResponse>('/dashboard', {
    baseURL: '/api',
    params: {
      start_date: params.startDate || undefined,
      end_date: params.endDate || undefined,
    },
  });

  return response.data;
}
