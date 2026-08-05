import { COMMENT_DEFAULT_PAGE, COMMENT_PAGE_SIZE } from '../model/constant';
import type { CommentListResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function fetchComments(
  postId: number,
  page = COMMENT_DEFAULT_PAGE,
  size = COMMENT_PAGE_SIZE,
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
