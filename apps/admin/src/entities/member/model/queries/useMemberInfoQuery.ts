'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getMemberInfo } from '../../api/getMemberInfo';
import type { MemberInfoResponse } from '../../api/types';
import { toMemberDetail } from '../mapper';
import type { Member } from '../types';
import { memberQueryKeys } from './memberQueryKeys';
import { Nullable } from '@/shared/types/nullable';

type UseMemberInfoQueryOptions = Omit<
  UseQueryOptions<MemberInfoResponse, Error, MemberInfoQueryData>,
  'queryKey' | 'queryFn'
>;

type MemberInfoQueryData = Nullable<Member>;

/**
 * 멤버 상세 정보 조회 훅
 */
export function useMemberInfoQuery(memberId?: number, options?: UseMemberInfoQueryOptions) {
  return useQuery<MemberInfoResponse, Error, MemberInfoQueryData>({
    queryKey: memberQueryKeys.detail(memberId?.toString() ?? 'unknown'),
    queryFn: () => getMemberInfo(memberId!),
    enabled: !!memberId,
    select: (response) => (response.data ? toMemberDetail(response.data, memberId!) : null),
    ...(options ?? {}),
  });
}
