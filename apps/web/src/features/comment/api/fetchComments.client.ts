import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommentListResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';

export async function fetchComments(
  postId: number,
  page = 0,
  size = 10,
): Promise<CommonResponse<CommentListResponse>> {
  const res = await axiosInstance.get<CommonResponse<CommentListResponse>>(
    `/v1/user/posts/${postId}/comments`,
    {
      params: { page, size },
    },
  );
  return res.data;
}
