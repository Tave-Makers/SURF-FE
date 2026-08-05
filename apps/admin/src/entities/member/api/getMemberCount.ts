import { ApiMemberStatus, MemberCountDTO, MemberCountResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export interface GetMemberCountParams {
  statuses: readonly ApiMemberStatus[];
  keyword: string;
}
export async function getMemberCount({
  statuses,
  keyword,
}: GetMemberCountParams): Promise<MemberCountDTO> {
  const response = await axiosInstance.get<MemberCountResponse>('/v1/user/members-count', {
    params: {
      memberStatuses: statuses,
      keyword,
    },
    paramsSerializer: { indexes: null },
  });

  return response.data.data;
}
