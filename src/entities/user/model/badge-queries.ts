'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMemberBadges } from '@/entities/user/api/index';

export const badgeKeys = {
  all: (memberId: number) => ['badges', memberId] as const,
  my: () => ['badges', 'my'] as const,
};

export function useBadgesInfiniteQuery(memberId?: number, pageSize = 9) {
  return useInfiniteQuery({
    queryKey: memberId ? badgeKeys.all(memberId) : badgeKeys.my(),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await getMemberBadges({
        ...(memberId && { memberId }),
        pageNum: pageParam,
        pageSize,
      });
      return response.data;
    },
    getNextPageParam: (last) => (last.isLast ? undefined : last.pageNumber + 1),
  });
}
