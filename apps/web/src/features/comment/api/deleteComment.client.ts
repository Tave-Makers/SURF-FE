import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  if (!Number.isFinite(postId) || postId <= 0) {
    throw new Error(`Invalid postId: ${postId}`);
  }

  if (!Number.isFinite(commentId) || commentId <= 0) {
    throw new Error(`Invalid commentId: ${commentId}`);
  }

  try {
    await axiosInstance.delete(`/v1/user/posts/${postId}/comments/${commentId}`);
  } catch (error) {
    throw handleApiError(error, '댓글을 삭제할 수 없습니다.');
  }
}
