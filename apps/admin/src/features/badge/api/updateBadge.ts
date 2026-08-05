import { BadgeResDto, UpdateBadgeRequest } from './types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function updateBadge(badgeId: number, data: UpdateBadgeRequest) {
  const response = await axiosInstance.patch<CommonResponse<BadgeResDto>>(
    `/v1/admin/badges/${badgeId}`,
    data,
  );
  return response.data.data;
}
