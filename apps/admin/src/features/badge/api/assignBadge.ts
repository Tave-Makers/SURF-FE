import { AssignBadgeMembersRequest } from './types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function assignBadgeMembers(badgeId: number, data: AssignBadgeMembersRequest) {
  const response = await axiosInstance.post<CommonResponse<null>>(
    `/v1/admin/badges/${badgeId}/members`,
    data,
  );
  return response.data.data;
}
