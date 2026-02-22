'use client';

import { useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { signupRequestQueryOptions } from './signupRequestQueryOptions';

/**
 * 가입 신청 목록 무한스크롤 훅
 *
 * useSuspenseInfiniteQuery를 사용하여 Suspense와 연동
 * 로딩 상태는 Suspense가, 에러 상태는 ErrorBoundary가 처리
 *
 * @param keyword - 검색어
 * @returns 무한스크롤에 필요한 데이터와 함수들
 */
export function useSignupRequestList(keyword = '') {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteQuery(signupRequestQueryOptions({ keyword, queryClient }));

  return {
    keyword,

    // 리스트 캐시에는 멤버 ID 목록만 유지
    memberIds: data.items,
    isLast: data.isLast,

    // 무한스크롤 메커니즘
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
