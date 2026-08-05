import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function toggleCommentLike(
  commentId: number,
): Promise<CommonResponse<{ liked: boolean }>> {
  const res = await axiosInstance.post<CommonResponse<{ liked: boolean }>>(
    `/v1/user/comments/${commentId}/like`,
  );
  return res.data;
}
