import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommentCreateRequest } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function createComment(
  postId: number,
  body: CommentCreateRequest,
): Promise<CommonResponse<null>> {
  try {
    const res = await axiosInstance.post<CommonResponse<null>>(
      `/v1/user/posts/${postId}/comments`,
      body,
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, '댓글을 생성할 수 없습니다');
  }
}
