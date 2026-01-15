'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { boardPostsQueryOptions } from './queryOptions';

export const useInfiniteBoardPosts = (params: Parameters<typeof boardPostsQueryOptions>[0]) => {
  return useInfiniteQuery(boardPostsQueryOptions(params));
};
