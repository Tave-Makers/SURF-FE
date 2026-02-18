'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { memberGenerationListQueryOptions } from './memberGenerationListQueryOptions';

/**
 * 전체 회원 수/기수 목록 조회 훅
 */
export function useMemberGenerationListQuery() {
  return useSuspenseQuery(memberGenerationListQueryOptions());
}
