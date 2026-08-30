import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommentResponse } from '@/features/comment/api/types';
import type { CommonResponse } from '@/shared/api/types';
import { handleApiError } from '@/shared/lib/handleApiError';

/**
 * 댓글 단건 조회.
 * 댓글이 없거나 작성자(댓글·게시글)를 차단한 경우 모두 404 — 차단 사실을 노출하지 않는 정책이다.
 */
export async function fetchComment(commentId: number): Promise<CommonResponse<CommentResponse>> {
  try {
    const res = await axiosInstance.get<CommonResponse<CommentResponse>>(
      `/v1/user/comments/${commentId}`,
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, '댓글을 불러올 수 없습니다.');
  }
}
