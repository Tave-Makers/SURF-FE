import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';
import { BadgeResDto } from './types';

export async function getBadgeDetail(badgeId: number) {
  const response = await axiosInstance.get<CommonResponse<BadgeResDto>>(
    `/v1/admin/badges/${badgeId}`,
  );
  return response.data.data;
}
