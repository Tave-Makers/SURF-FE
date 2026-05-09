import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';
import { RemoveBadgeMembersRequest } from './types';

export async function removeBadgeMembers(badgeId: number, data: RemoveBadgeMembersRequest) {
  const response = await axiosInstance.delete<CommonResponse<null>>(
    `/v1/admin/badges/${badgeId}/members`,
    { data },
  );
  return response.data.data;
}
