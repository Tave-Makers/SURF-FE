import { MemberRole } from '@/entities/member/model/types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function updateMemberRole({
  memberId,
  role,
}: {
  memberId: number;
  role: MemberRole;
}): Promise<null> {
  const response = await axiosInstance.patch<CommonResponse<null>>(
    `/v1/admin/members/${memberId}/role`,
    {
      role,
    },
  );

  return response.data.data;
}
