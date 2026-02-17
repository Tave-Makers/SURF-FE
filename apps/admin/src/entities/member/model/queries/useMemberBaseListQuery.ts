'use client';

import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { MemberBase } from '../types';
import { memberQueryKeys } from './memberQueryKeys';

/**
 * 멤버 ID 목록을 기준으로 base 캐시를 구독
 *
 * 서버 요청 없이 캐시에 있는 데이터를 읽어 조합 렌더링할 때 사용
 */
export function useMemberBaseListQuery(memberIds: number[]) {
  const queryClient = useQueryClient();

  const queries = useQueries({
    queries: memberIds.map((memberId) => ({
      queryKey: memberQueryKeys.base(memberId),
      queryFn: (): Promise<MemberBase> => {
        const cached = queryClient.getQueryData<MemberBase>(memberQueryKeys.base(memberId));
        if (cached) {
          return Promise.resolve(cached);
        }

        return Promise.reject(new Error(`Missing member base cache for id ${memberId}`));
      },
      // 네트워크 요청은 막고, 캐시 변경만 구독
      enabled: false,
      staleTime: Infinity,
      // 첫 렌더에서도 캐시 값을 바로 사용해 깜빡임을 줄임
      initialData: () => queryClient.getQueryData<MemberBase>(memberQueryKeys.base(memberId)),
    })),
  });

  // 단일 순회로 hydration 여부와 멤버 배열을 함께 계산
  const members: MemberBase[] = [];
  let isHydrated = true;

  for (const query of queries) {
    if (!query.data) {
      isHydrated = false;
      break;
    }

    members.push(query.data);
  }

  return {
    members: isHydrated ? members : [],
    isHydrated,
  };
}
