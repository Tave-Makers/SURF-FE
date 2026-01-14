import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommentCreateRequest } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';

export async function createComment(
  postId: number,
  body: CommentCreateRequest,
): Promise<CommonResponse<null>> {
  const res = await axiosInstance.post<CommonResponse<null>>(
    `/v1/user/posts/${postId}/comments`,
    body,
  );
  return res.data;
}
