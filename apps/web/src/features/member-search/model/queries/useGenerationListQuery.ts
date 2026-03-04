'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { generationListQueryOptions } from './generationListQueryOptions';

/**
 * 전체 기수 목록 조회 훅
 */
export function useGenerationListQuery() {
  return useSuspenseQuery(generationListQueryOptions());
}
