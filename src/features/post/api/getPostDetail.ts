import { axiosInstance } from '@/shared/lib/axiosInstance';
import { PostDetailResponse } from '@/entities/post/api/types';

/**
 * 게시글 단건 조회
 */
export const getPostDetail = async (postId: number): Promise<PostDetailResponse['data']> => {
  try {
    const response = await axiosInstance.get<PostDetailResponse>(`/v1/user/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching post detail:', error);
    throw error;
  }
};
