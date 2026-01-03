import { PostDetailData, PostDetailResponse } from '@/entities/post/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { UpdatePostRequest } from './types';

export const updatePost = async (
  postId: number,
  data: UpdatePostRequest,
): Promise<PostDetailData> => {
  const res = await axiosInstance.patch<PostDetailResponse>(`/v1/user/posts/${postId}`, data);
  return res.data.data;
};
