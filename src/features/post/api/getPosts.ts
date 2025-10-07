import { axiosInstance } from '@/shared/lib/axiosInstance';
import { FullApiResponse, PostApiResponse, PostApiRequest } from '@/entities/post/api/types';

export const getPosts = {
  // 내가 작성한 게시글 조회 요청
  getMyPosts: async (params: Partial<PostApiRequest>): Promise<PostApiResponse> => {
    const pageable = {
      page: params?.page || 0,
      size: params?.size || 10,
      sort: params?.sort || [],
    };

    try {
      const response = await axiosInstance.get<FullApiResponse>(
        `/v1/user/posts/me?pageable=${encodeURIComponent(JSON.stringify(pageable))}`,
      );
      return response.data.data;
    } catch (error) {
      console.log('[내가 작성한 게시글 조회 요청 실패:', error);
      throw error;
    }
  },

  // 스크랩한 게시글 조회 요청
  getScraps: async (params: Partial<PostApiRequest>): Promise<PostApiResponse> => {
    const pageable = {
      page: params?.page || 0,
      size: params?.size || 10,
      sort: params?.sort || [],
    };

    try {
      const response = await axiosInstance.get<FullApiResponse>(
        `/v1/user/scraps/me?pageable=${encodeURIComponent(JSON.stringify(pageable))}`,
      );
      return response.data.data;
    } catch (error) {
      console.log('[내가 스크랩한 게시글 조회 요청 실패]:', error);
      throw error;
    }
  },
};
