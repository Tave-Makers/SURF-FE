import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommentListResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function fetchComments(
  postId: number,
  page = 0,
  size = 10,
): Promise<CommonResponse<CommentListResponse>> {
  try {
    const res = await axiosInstance.get<CommonResponse<CommentListResponse>>(
      `/v1/user/posts/${postId}/comments`,
      { params: { page, size } },
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, '댓글을 불러올 수 없습니다.');
  }
}
