import { useInfiniteQuery } from '@tanstack/react-query';
import { memberSearchQueryOptions } from '@/features/member-search/api/queryOptions';
import { MemberSearchFilters } from '@/entities/search/model/types';

export function useMemberSearch(filters: MemberSearchFilters) {
  const queryFilters = {
    keyword: filters.keyword,
    generation: filters.generation ?? undefined,
    part: filters.part ?? undefined,
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
