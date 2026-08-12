'use client';

import { useQuery } from '@tanstack/react-query';
import { getMemberInfo } from '../../api/getMemberInfo';
import { toMemberDetail } from '../mapper';
import type { Member } from '../types';
import { memberQueryKeys } from './memberQueryKeys';

type UseMemberDetailQueryParams = {
  memberId: number;
  enabled?: boolean;
};

/**
 * 멤버 상세 정보 단건 조회 훅.
 * Suspense 없이 로딩/에러 상태를 직접 다뤄야 하는 화면에서 사용한다.
 * (Suspense 기반이 필요하면 `useMemberInfoQuery`를 사용)
 */
export function useMemberDetailQuery({ memberId, enabled = true }: UseMemberDetailQueryParams) {
  return useQuery<Member, Error>({
    queryKey: memberQueryKeys.detail(memberId),
    queryFn: async () => {
      const response = await getMemberInfo(memberId);

      return toMemberDetail(response.data, memberId);
    },
    enabled,
    retry: false,
  });
}
