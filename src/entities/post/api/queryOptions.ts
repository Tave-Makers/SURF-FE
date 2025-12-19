import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { postApi } from './postApi';
import { postQueryKeys } from './queryKeys';
import type { GetBoardPostsRequest } from './types';

export const boardPostsQueryOptions = (params: Omit<GetBoardPostsRequest, 'page' | 'size'>) =>
  infiniteQueryOptions({
    queryKey: postQueryKeys.boardPosts(params.boardId, params.category),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      postApi.getBoardPosts({
        ...params,
        page: pageParam,
        size: 20,
      }),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

export const myPostsQueryOptions = (params: Partial<GetBoardPostsRequest>) =>
  queryOptions({
    queryKey: postQueryKeys.myPosts(),
    queryFn: () => postApi.getMyPosts(params),
  });

export const scrapsQueryOptions = (params: Partial<GetBoardPostsRequest>) =>
  queryOptions({
    queryKey: postQueryKeys.scraps(),
    queryFn: () => postApi.getScraps(params),
  });

export const postDetailQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: postQueryKeys.postDetail(postId),
    queryFn: async () => {
      // 1) 상세 조회
      const detail = await postApi.getPostDetail(postId);

      // 2) 일정 조회
      let schedule = null;
      if (detail.hasSchedule) {
        try {
          schedule = await postApi.getPostSchedule(postId);
        } catch (error) {
          console.error('Failed to fetch post schedule:', error);
        }
      }

      // 3) 조합 후 그대로 반환 (select 에서 transform)
      return {
        ...detail,
        schedule,
      };
    },
  });
