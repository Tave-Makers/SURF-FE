import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { MentionSearchResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';

export async function searchMentionableMembers(
  keyword: string,
): Promise<CommonResponse<MentionSearchResponse[]>> {
  const res = await axiosInstance.get<CommonResponse<MentionSearchResponse[]>>(
    `/v1/user/comments/mentions/search`,
    {
      params: { keyword },
    },
  );
  return res.data;
}
