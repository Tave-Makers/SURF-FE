'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import {
  BLOCKED_MEMBERS_DEFAULT_PAGE,
  BLOCKED_MEMBERS_PAGE_SIZE,
  fetchBlockedMembers,
} from '../api/fetchBlockedMembers.client';
import { toBlockedMember } from './mappers';
import { blockQueryKeys } from './queryKeys';

/** 차단한 회원 목록 조회 (최신순, 무한 스크롤) */
export const useBlockedMembersQuery = () =>
  useInfiniteQuery({
    queryKey: blockQueryKeys.blockedMembers(),
    queryFn: ({ pageParam }) => fetchBlockedMembers(pageParam, BLOCKED_MEMBERS_PAGE_SIZE),
    initialPageParam: BLOCKED_MEMBERS_DEFAULT_PAGE,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.pageNumber + 1 : undefined),
    select: (data) => data.pages.flatMap((page) => page.content.map(toBlockedMember)),
  });
