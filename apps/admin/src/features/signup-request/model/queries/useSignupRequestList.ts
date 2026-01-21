'use client';

import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { signupRequestQueryOptions } from './signupRequestQueryOptions';
import { SignupRequestFilters } from './signupRequestQueryKeys';

/**
 * 가입 신청 목록 무한스크롤 훅
 *
 * useSuspenseInfiniteQuery를 사용하여 Suspense와 연동
 * 로딩 상태는 Suspense가, 에러 상태는 ErrorBoundary가 처리
 *
 * @param filters - 필터 조건 (keyword, pageSize)
 * @returns 무한스크롤에 필요한 데이터와 함수들
 */
export function useSignupRequestList(filters: SignupRequestFilters = {}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteQuery(signupRequestQueryOptions(filters));

  return {
    // 필터 정보
    ...filters,

    // 변환된 데이터 (SignupRequestMember[])
    members: data.items,
    totalCount: data.totalCount,
    isLast: data.isLast,

    // 무한스크롤 메커니즘
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
