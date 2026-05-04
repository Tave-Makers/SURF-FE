import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';
import { BadgeMembersResDto } from './types';

export async function getBadgeMembers(badgeId: number) {
  const response = await axiosInstance.get<CommonResponse<BadgeMembersResDto>>(
    `/v1/admin/badges/${badgeId}/members`,
  );
  return response.data.data;
}
