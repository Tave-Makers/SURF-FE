'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/features/post/api/getPosts';
import { PostApiResponse } from '@/entities/post/api/types';

/** 내가 작성한 게시글 단일 페이지 조회 */
export const useMyPosts = (page: number = 0, size: number = 10, sort: string[] = []) => {
  return useQuery<PostApiResponse>({
    queryKey: ['posts', 'my-posts', page, size, sort.join(',')],
    queryFn: () => getPosts.getMyPosts({ page, size, sort }),
  });
};

/** 내가 작성한 게시글 무한 스크롤 조회 */
export const useInfiniteMyPosts = (size: number = 10, sort: string[] = []) => {
  return useInfiniteQuery<PostApiResponse>({
    queryKey: ['posts', 'my-posts', 'infinite', size, sort.join(',')],
    queryFn: ({ pageParam = 0 }) => {
      const page = pageParam as number;
      return getPosts.getMyPosts({ page, size, sort });
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
