'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { PostApiResponse } from '@/entities/post/api/types';
import { getPosts } from '@/features/post/api/getPosts';

// 스크랩한 게시글 조회 훅 (단일 페이지) - 현재 MVP2에서는 필요 없음
export const useScraps = (page: number = 0, size: number = 10, sort: string[] = []) => {
  return useQuery<PostApiResponse>({
    queryKey: ['posts', 'scraps', page, size, sort],
    queryFn: () => getPosts.getScraps({ page, size, sort }),
  });
};

// 스크랩한 게시글 조회 무한 스크롤 훅
export const useInfiniteScraps = (size: number = 10, sort: string[] = []) => {
  return useInfiniteQuery<PostApiResponse>({
    queryKey: ['posts', 'scraps', 'infinite', size, sort],
    queryFn: ({ pageParam }) => getPosts.getScraps({ page: pageParam as number, size, sort }),
    getNextPageParam: (lastPage) => {
      // 마지막 페이지가 아니면 다음 페이지 번호 반환
      return lastPage.last ? undefined : lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
