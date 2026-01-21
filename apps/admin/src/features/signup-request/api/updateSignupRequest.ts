import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function updateSignupRequest(
  memberIds: number[],
  nextStatus: string,
): Promise<CommonResponse<null>> {
  const response = await axiosInstance.patch<CommonResponse<null>>(
    `/v1/admin/members/${nextStatus}`,
    memberIds,
  );

  return response.data;
}
