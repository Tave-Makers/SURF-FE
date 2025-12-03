import { axiosInstance } from '@/shared/lib/axiosInstance';
import type {
  FullPostListResponse,
  PostListApiResponse,
  PostApiRequest,
  GetBoardPostsRequest,
  PostDetailResponse,
} from './types';

export const postApi = {
  getMyPosts: async (params: Partial<PostApiRequest>): Promise<PostListApiResponse> => {
    const response = await axiosInstance.get<FullPostListResponse>('/v1/user/posts/me', {
      params,
    });
    return response.data.data;
  },

  getScraps: async (params: Partial<PostApiRequest>): Promise<PostListApiResponse> => {
    const response = await axiosInstance.get<FullPostListResponse>('/v1/user/scraps/me', {
      params,
    });
    return response.data.data;
  },

  getBoardPosts: async (params: GetBoardPostsRequest): Promise<PostListApiResponse> => {
    const { boardId, category, page, size, sort } = params;

    const response = await axiosInstance.get<FullPostListResponse>(
      `/v1/user/posts/board/${boardId}`,
      {
        params: {
          category: category === 'all' ? undefined : category,
          page,
          size,
          sort,
        },
      },
    );

    return response.data.data;
  },

  getPostDetail: async (postId: number): Promise<PostDetailResponse['data']> => {
    const response = await axiosInstance.get<PostDetailResponse>(`/v1/user/posts/${postId}`);
    return response.data.data;
  },
};
