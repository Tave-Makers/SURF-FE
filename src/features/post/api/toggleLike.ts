import { axiosInstance } from '@/shared/lib/axiosInstance';

export const toggleLike = async (postId: number, liked: boolean) => {
  if (liked) {
    await axiosInstance.delete(`/v1/user/posts/${postId}/like`);
  } else {
    await axiosInstance.post(`/v1/user/posts/${postId}/like`);
  }
};
