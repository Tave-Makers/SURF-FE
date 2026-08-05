import { useInfiniteQuery } from '@tanstack/react-query';
import { MemberSearchFilters } from '@/entities/search/model/types';
import { memberSearchQueryOptions } from '@/features/member-search/model/queries/queryOptions';

export function useInfiniteMemberSearchQuery(filters: MemberSearchFilters) {
  const queryFilters = {
    ...filters,
    keyword: filters.debouncedKeyword,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery(memberSearchQueryOptions(queryFilters));

  return {
    // 필터 관련 상태 및 액션
    ...filters,

    // 쿼리 결과 데이터
    members: data?.members ?? [],
    totalCount: data?.totalCount ?? 0,
    isLast: data?.isLast ?? true,

    // 무한 스크롤 관련 상태 및 함수
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
}
