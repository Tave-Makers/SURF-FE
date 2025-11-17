import { axiosInstance } from '@/shared/lib/axiosInstance';

export const toggleScrap = async (postId: number, scrapped: boolean) => {
  if (scrapped) {
    await axiosInstance.delete(`/v1/user/scraps/${postId}`);
  } else {
    await axiosInstance.post(`/v1/user/scraps/${postId}`);
  }
};
