import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function deleteComment(postId: string, commentId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/user/posts/${postId}/comments/${commentId}`);
  } catch (error) {
    throw handleApiError(error, '댓글을 삭제할 수 없습니다.');
  }
}
