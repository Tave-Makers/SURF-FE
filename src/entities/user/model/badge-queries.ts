'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getMemberBadges } from '@/entities/user/api';
import { handleApiError } from '@/shared/lib/handleApiError';

export const badgeKeys = {
  all: (memberId: number, pageSize: number) => ['badges', memberId, pageSize] as const,
  my: (pageSize: number) => ['badges', 'my', pageSize] as const,
};

export function useBadgesInfiniteQuery(memberId?: number, pageSize = 9) {
  return useInfiniteQuery({
    queryKey: memberId ? badgeKeys.all(memberId, pageSize) : badgeKeys.my(pageSize),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      try {
        const res = await getMemberBadges({
          ...(memberId && { memberId }),
          pageNum: pageParam,
          pageSize,
        });
        return res.data;
      } catch (e) {
        throw handleApiError(e, '배지 목록을 불러오는데 실패했습니다.');
      }
    },
    getNextPageParam: (last) => (last.isLast ? undefined : last.pageNumber + 1),
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1, // 실패 시 1회만 재시도
    refetchOnWindowFocus: false, // 스크롤 UI를 위해 off
  });
}
