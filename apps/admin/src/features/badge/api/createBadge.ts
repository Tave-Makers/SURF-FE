import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CreateBadgeRequest } from './types';
import { CommonResponse } from '@/shared/api/types';

export async function createBadge(data: CreateBadgeRequest) {
  const response = await axiosInstance.post<CommonResponse<{ badgeId: number }>>(
    '/v1/admin/badges',
    data,
  );
  return response.data.data;
}
