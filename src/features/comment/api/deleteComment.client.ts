import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  await axiosInstance.delete(`/v1/user/posts/${postId}/comments/${commentId}`);
}
