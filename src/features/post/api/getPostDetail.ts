import { axiosInstance } from '@/shared/lib/axiosInstance';
import { PostDetailResponse } from '@/entities/post/api/types';

/**
 * 게시글 단건 조회
 * @param postId 게시글 ID
 * @returns 게시글 상세 정보(PostDetailResponse['data'])
 */
export const getPostDetail = async (postId: number): Promise<PostDetailResponse['data']> => {
  const response = await axiosInstance.get<PostDetailResponse>(`/v1/user/posts/${postId}`);
  return response.data.data;
};
