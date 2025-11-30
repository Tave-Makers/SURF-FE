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

// export const postDetailQueryOptions = (postId: number) =>
//   queryOptions({
//     queryKey: [...postQueryKeys.all, 'detail', postId],
//     queryFn: () => postApi.getDetail(postId),
//     staleTime: 1000 * 60 * 10,
//   });
