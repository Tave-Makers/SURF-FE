'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getBadges } from '@/entities/user/api/getBadges';
import { handleApiError } from '@/shared/lib/handleApiError';

export const badgeKeys = {
  me: (pageSize: number) => ['badges', 'me', pageSize] as const,
  member: (memberId: number, pageSize: number) => ['badges', 'member', memberId, pageSize] as const,
};

type Options = {
  memberId?: number;
  pageSize?: number;
  enabled?: boolean;
};

export function useInfiniteBadges({ memberId, pageSize = 9, enabled = true }: Options) {
  const isOther = memberId != null;

  return useInfiniteQuery({
    enabled,
    queryKey: isOther ? badgeKeys.member(memberId, pageSize) : badgeKeys.me(pageSize),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      try {
        const res = await getBadges({
          memberId: isOther ? memberId : undefined,
          pageNum: pageParam,
          pageSize,
        });
        return res.data;
      } catch (e) {
        throw handleApiError(e, '배지 목록을 불러오는데 실패했습니다.');
      }
    },
    getNextPageParam: (last) => (last.isLast ? undefined : last.pageNumber + 1),
  });
}
