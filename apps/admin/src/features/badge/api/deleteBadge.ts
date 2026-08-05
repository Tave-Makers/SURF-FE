import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deleteBadge(badgeId: number) {
  const response = await axiosInstance.delete<CommonResponse<null>>(`/v1/admin/badges/${badgeId}`);
  return response.data.data;
}
