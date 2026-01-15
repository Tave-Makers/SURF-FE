import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { MentionSearchResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function searchMentionableMembers(
  keyword: string,
): Promise<CommonResponse<MentionSearchResponse[]>> {
  try {
    const res = await axiosInstance.get<CommonResponse<MentionSearchResponse[]>>(
      `/v1/user/comments/mentions/search`,
      {
        params: { keyword },
      },
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, '멘션 목록을 불러올 수 없습니다.');
  }
}
