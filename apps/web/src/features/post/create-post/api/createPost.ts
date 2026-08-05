import { CreatePostRequest } from './types';
import { PostDetailData, PostDetailResponse } from '@/entities/post/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const createPost = async (data: CreatePostRequest): Promise<PostDetailData> => {
  try {
    const res = await axiosInstance.post<PostDetailResponse>('/v1/user/posts', data);
    return res.data.data;
  } catch (err) {
    console.error('게시글 생성 실패', err);
    throw err;
  }
};
