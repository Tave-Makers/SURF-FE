'use client';

import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { getMemberInfo } from '../../api/getMemberInfo';
import { toMemberDetail } from '../mapper';
import type { Member } from '../types';
import { memberQueryKeys } from './memberQueryKeys';

type UseMemberInfoQueryOptions = Omit<
  UseSuspenseQueryOptions<Member, Error, Member>,
  'queryKey' | 'queryFn'
>;

/**
 * 멤버 상세 정보 조회 훅
 */
export function useMemberInfoQuery(memberId: number, options?: UseMemberInfoQueryOptions) {
  return useSuspenseQuery<Member, Error, Member>({
    queryKey: memberQueryKeys.detail(memberId),
    queryFn: async () => {
      const response = await getMemberInfo(memberId);
      return toMemberDetail(response.data, memberId);
    },
    ...(options ?? {}),
  });
}
