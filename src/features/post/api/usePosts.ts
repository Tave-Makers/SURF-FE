'use client';

import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/features/post/api/getPosts';
import { PostApiResponse } from '@/entities/post/api/types';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 내 게시글 조회 훅
export const useMyPosts = (
  page: number = 0,
  size: number = 10,
  sort: string[] = [],
  opts?: { enabled?: boolean },
) => {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // persist rehydrate 이후에만 가드 실행
    if (!useAuthStore.persist?.hasHydrated?.()) return;
    if (!accessToken) router.replace('/login');
  }, [accessToken, router]);

  return useQuery<PostApiResponse>({
    queryKey: ['posts', 'my-posts', page, size, sort],
    queryFn: () => getPosts.getMyPosts({ page, size, sort }),
    enabled: !!accessToken && (opts?.enabled ?? true), // 조건부 실행
    staleTime: 5 * 60 * 1000, // 데이터 신선도 5분
    gcTime: 10 * 60 * 1000, // 캐시된 데이터 유지 시간 10분
  });
};

// 스크랩한 게시글 조회 훅
export const useScraps = (
  page: number = 0,
  size: number = 10,
  sort: string[] = [],
  opts?: { enabled?: boolean },
) => {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      // 인증토큰 없으면 로그인 페이지로 이동
      router.push('/login');
    }
  }, [accessToken, router]);

  return useQuery<PostApiResponse>({
    queryKey: ['posts', 'scraps', page, size, sort],
    queryFn: () => getPosts.getScraps({ page, size, sort }),
    enabled: !!accessToken && (opts?.enabled ?? true), // 조건부 실행
    staleTime: 5 * 60 * 1000, // 데이터 신선도 5분
    gcTime: 10 * 60 * 1000, // 캐시된 데이터 유지 시간 10분
  });
};
