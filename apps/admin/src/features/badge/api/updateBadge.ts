import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';
import { BadgeResDto, UpdateBadgeRequest } from './types';

export async function updateBadge(badgeId: number, data: UpdateBadgeRequest) {
  const response = await axiosInstance.patch<CommonResponse<BadgeResDto>>(
    `/v1/admin/badges/${badgeId}`,
    data,
  );
  return response.data.data;
}
