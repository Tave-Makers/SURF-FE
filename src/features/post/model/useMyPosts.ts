'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getPosts } from '@/features/post/api/getPosts';
import { PostApiResponse } from '@/entities/post/api/types';

// 내 게시글 조회 훅 (단일 페이지) - 현재 MVP2에서는 필요 없음
export const useMyPosts = (page: number = 0, size: number = 10, sort: string[] = []) => {
  return useQuery<PostApiResponse>({
    queryKey: ['posts', 'my-posts', page, size, sort],
    queryFn: () => getPosts.getMyPosts({ page, size, sort }),
  });
};

// 내 게시글 조회 무한 스크롤 훅
export const useInfiniteMyPosts = (size: number = 10, sort: string[] = []) => {
  return useInfiniteQuery<PostApiResponse>({
    queryKey: ['posts', 'my-posts', 'infinite', size, sort],
    queryFn: ({ pageParam }) => getPosts.getMyPosts({ page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
