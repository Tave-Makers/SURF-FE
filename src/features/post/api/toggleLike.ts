import { axiosInstance } from '@/shared/lib/axiosInstance';
import { isAxiosError } from 'axios';

export const toggleLike = async (postId: number, liked: boolean): Promise<void> => {
  const method = liked ? 'DELETE' : 'POST';
  const url = `/v1/user/posts/${postId}/like`;

  try {
    if (method === 'DELETE') {
      await axiosInstance.delete(url);
    } else {
      await axiosInstance.post(url);
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('[좋아요 토글 실패]', error.response?.data);
    } else {
      console.log('[좋아요 토글 실패 - 기타 에러]', error);
    }
    throw error;
  }
};
