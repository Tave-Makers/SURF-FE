import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getPosts } from './getPosts';
import { postQueryKeys } from './queryKeys';
import type { GetBoardPostsRequest } from './types';

export const boardPostsQueryOptions = (params: Omit<GetBoardPostsRequest, 'page' | 'size'>) =>
  infiniteQueryOptions({
    queryKey: postQueryKeys.boardPosts(params.boardId, params.category),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getPosts.getBoardPosts({
        ...params,
        page: pageParam,
        size: 10,
      }),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });

export const myPostsQueryOptions = (params: Partial<GetBoardPostsRequest>) =>
  queryOptions({
    queryKey: postQueryKeys.myPosts(),
    queryFn: () => getPosts.getMyPosts(params),
  });

export const scrapsQueryOptions = (params: Partial<GetBoardPostsRequest>) =>
  queryOptions({
    queryKey: postQueryKeys.scraps(),
    queryFn: () => getPosts.getScraps(params),
  });

export const postDetailQueryOptions = (postId: number) =>
  queryOptions({
    queryKey: [...postQueryKeys.all, 'detail', postId],
    queryFn: () => getPosts.getDetail(postId),
    staleTime: 1000 * 60 * 10,
  });
