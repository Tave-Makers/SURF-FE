import { useQuery } from '@tanstack/react-query';
import { getMemberCount, GetMemberCountParams } from '../../api/getMemberCount';

import { ApiMemberStatus } from '../../api/types';
import { memberQueryKeys } from './memberQueryKeys';

export const SIGNUP_REQUEST_COUNT_STATUSES = [
  'WAITING',
  'REJECTED',
] as const satisfies readonly ApiMemberStatus[];

export const APPROVED_MEMBER_COUNT_STATUSES = [
  'APPROVED',
] as const satisfies readonly ApiMemberStatus[];

const normalizeCountFilters = ({ statuses, keyword }: GetMemberCountParams) => ({
  statuses: [...new Set(statuses)].sort(),
  keyword: keyword.trim(),
});

/**
 * 멤버 상태/검색어 조건으로 멤버 수를 조회하는 범용 카운트 쿼리 훅
 */
export function useMemberCountQuery(filters: GetMemberCountParams) {
  const normalized = normalizeCountFilters(filters);
  return useQuery({
    queryKey: memberQueryKeys.count(normalized),
    queryFn: async () => {
      const data = await getMemberCount(normalized);
      return data.membersCount;
    },
    placeholderData: (prev) => prev,
  });
}

/**
 * 가입 신청 목록(WAITING, REJECTED) 대상 멤버 수를 조회하는 카운트 쿼리 훅
 */
export function useSignupRequestCountQuery(keyword: string) {
  const filters = normalizeCountFilters({
    statuses: SIGNUP_REQUEST_COUNT_STATUSES,
    keyword,
  });

  return useQuery({
    queryKey: memberQueryKeys.count(filters),
    queryFn: async () => {
      const data = await getMemberCount(filters);
      return data.membersCount;
    },
    placeholderData: (prev) => prev,
  });
}

/**
 * 승인된(APPROVED) 멤버 수를 조회하는 카운트 쿼리 훅
 */
export function useApprovedMemberCountQuery(keyword: string) {
  const filters = normalizeCountFilters({
    statuses: APPROVED_MEMBER_COUNT_STATUSES,
    keyword,
  });
  return useQuery({
    queryKey: memberQueryKeys.count(filters),
    queryFn: async () => {
      const data = await getMemberCount(filters);
      return data.membersCount;
    },
    placeholderData: (prev) => prev,
  });
}
