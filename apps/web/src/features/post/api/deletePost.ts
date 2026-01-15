import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deletePost(postId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/user/posts/${postId}`);
  } catch (error) {
    console.error('Error deleting post :', error);
    throw error;
  }
}
