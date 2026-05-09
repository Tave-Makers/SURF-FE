import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function expelMember(memberId: number): Promise<null> {
  const response = await axiosInstance.patch<CommonResponse<null>>(
    `/v1/admin/members/${memberId}/expel`,
  );

  return response.data.data;
}
