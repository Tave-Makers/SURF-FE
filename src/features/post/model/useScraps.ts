'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { postApi } from '@/entities/post/api/postApi';
import { PostListApiResponse } from '@/entities/post/api/types';

/** 스크랩한 게시글 단일 페이지 조회 */
export const useScraps = (page: number = 0, size: number = 20, sort: string = '') => {
  return useQuery<PostListApiResponse>({
    queryKey: ['posts', 'scraps', page, size, sort],
    queryFn: () => postApi.getScraps({ page, size, sort }),
  });
};

/** 스크랩한 게시글 무한 스크롤 조회 */
export const useInfiniteScraps = (size: number = 20, sort: string = '') => {
  return useInfiniteQuery<PostListApiResponse>({
    queryKey: ['posts', 'scraps', 'infinite', size, sort],
    queryFn: ({ pageParam = 0 }) => {
      const page = pageParam as number;
      return postApi.getScraps({ page, size, sort });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last || lastPage.empty || lastPage.numberOfElements === 0) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
