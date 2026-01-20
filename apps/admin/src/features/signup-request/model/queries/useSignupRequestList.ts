'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { signupRequestQueryOptions } from './signupRequestQueryOptions';
import { SignupRequestFilters } from './signupRequestQueryKeys';

/**
 * 가입 신청 목록 무한스크롤 훅
 *
 * TanStack Query의 useInfiniteQuery를 사용하여 무한스크롤을 구현합니다.
 * 페이지네이션 기반으로 동작하며, 스크롤 시 자동으로 다음 페이지를 로드합니다.
 *
 * @param filters - 필터 조건 (keyword, pageSize)
 * @returns 무한스크롤에 필요한 데이터와 함수들
 *
 */
export function useSignupRequestList(filters: SignupRequestFilters = {}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery(signupRequestQueryOptions(filters));

  return {
    // 필터 정보
    ...filters,

    // 변환된 데이터 (SignupRequestMember[])
    members: data?.members ?? [],
    totalCount: data?.totalCount ?? 0,
    isLast: data?.isLast ?? true,

    // 무한스크롤 메커니즘
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
}
