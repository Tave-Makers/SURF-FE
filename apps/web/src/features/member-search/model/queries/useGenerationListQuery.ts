'use client';

import { useQuery } from '@tanstack/react-query';

import { generationListQueryOptions } from '@/features/member-search/model/queries/queryOptions';

/**
 * 전체 기수 목록 조회 훅
 */
export function useGenerationListQuery() {
  const query = useQuery(generationListQueryOptions());
  return {
    ...query,
    data: query.data ?? [],
  };
}
