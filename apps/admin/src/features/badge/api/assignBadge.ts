import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';
import { AssignBadgeMembersRequest } from './types';

export async function assignBadgeMembers(badgeId: number, data: AssignBadgeMembersRequest) {
  const response = await axiosInstance.post<CommonResponse<null>>(
    `/v1/admin/badges/${badgeId}/members`,
    data,
  );
  return response.data.data;
}
