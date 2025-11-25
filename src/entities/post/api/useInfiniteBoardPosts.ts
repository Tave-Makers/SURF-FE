'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from './getPosts';
import type { GetBoardPostsRequest } from './types';

export const useInfiniteBoardPosts = (params: Omit<GetBoardPostsRequest, 'page' | 'size'>) => {
  return useInfiniteQuery({
    queryKey: ['board-posts', params.boardId, params.category],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getPosts.getBoardPosts({
        ...params,
        page: pageParam,
        size: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
