import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { MemberGroupedByPartDTO, MembersGroupedByPartResponse } from './types';

/** 활동 기수에 해당하는 회원을 파트별로 묶어 조회한다. */
export async function getGroupedMembersByPart(
  generation: number,
): Promise<MemberGroupedByPartDTO[]> {
  const response = await axiosInstance.get<MembersGroupedByPartResponse>(
    '/v1/admin/members/grouped-by-part',
    { params: { generation } },
  );

  return response.data.data ?? [];
}
