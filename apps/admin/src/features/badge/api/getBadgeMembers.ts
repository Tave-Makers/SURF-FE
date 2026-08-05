import { BadgeMembersResDto } from './types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getBadgeMembers(badgeId: number) {
  const response = await axiosInstance.get<CommonResponse<BadgeMembersResDto>>(
    `/v1/admin/badges/${badgeId}/members`,
  );
  return response.data.data;
}
