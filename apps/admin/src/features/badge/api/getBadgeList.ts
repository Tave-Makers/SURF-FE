import { BadgeListData, BadgeListParams, BadgeListResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getBadgeList(params: BadgeListParams): Promise<BadgeListData> {
  const response = await axiosInstance.get<BadgeListResponse>('/v1/admin/badges', { params });

  return response.data.data;
}
