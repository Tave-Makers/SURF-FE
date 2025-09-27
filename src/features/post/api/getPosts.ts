import { axiosInstance } from '@/shared/lib/axiosInstance';
import { PostApiResponse, PostApiRequest } from '@/entities/post/api/types';

export const getPosts = {
  // 내가 작성한 게시글 조회 요청
  getMyPosts: async (params: Partial<PostApiRequest>): Promise<PostApiResponse> => {
    const pageable = {
      page: params?.page || 0,
      size: params?.size || 10,
      sort: params?.sort || [],
    };

    const response = await axiosInstance.get<PostApiResponse>(
      `/v1/posts/me?pageable=${encodeURIComponent(JSON.stringify(pageable))}`,
    );
    return response.data;
  },

  // 스크랩한 게시글 조회 요청
  getScraps: async (params: Partial<PostApiRequest>): Promise<PostApiResponse> => {
    const pageable = {
      page: params?.page || 0,
      size: params?.size || 10,
      sort: params?.sort || [],
    };

    const response = await axiosInstance.get<PostApiResponse>(
      `/v1/scraps/me?pageable=${encodeURIComponent(JSON.stringify(pageable))}`,
    );
    return response.data;
  },
};
