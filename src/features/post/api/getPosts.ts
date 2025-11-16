'use client';

import { axiosInstance } from '@/shared/lib/axiosInstance';
import type {
  PostListApiResponse,
  FullPostListResponse,
  PostApiRequest,
} from '@/entities/post/api/types';

export const getPosts = {
  getMyPosts: async (params: Partial<PostApiRequest>): Promise<PostListApiResponse> => {
    const { page, size, sort } = params;

    try {
      const response = await axiosInstance.get<FullPostListResponse>('/v1/user/posts/me', {
        params: { page, size, sort },
      });
      return response.data.data;
    } catch (error) {
      console.error('[내가 작성한 게시글 조회 요청 실패]:', error);
      throw error;
    }
  },

  getScraps: async (params: Partial<PostApiRequest>): Promise<PostListApiResponse> => {
    const { page, size, sort } = params;

    try {
      const response = await axiosInstance.get<FullPostListResponse>('/v1/user/scraps/me', {
        params: { page, size, sort },
      });
      return response.data.data;
    } catch (error) {
      console.error('[내가 스크랩한 게시글 조회 요청 실패]:', error);
      throw error;
    }
  },
};
