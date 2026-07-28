'use client';

import { useQuery } from '@tanstack/react-query';
import { getBadges } from '@/entities/user/api/getBadges';
import { handleApiError } from '@/shared/lib/handleApiError';

export const badgeKeys = {
  pending: () => ['badges', 'member', 'pending'] as const,
  member: (memberId: number) => ['badges', 'member', memberId] as const,
};

type Options = {
  memberId?: number;
  enabled?: boolean;
};

export function useBadges({ memberId, enabled = true }: Options) {
  const canFetch = enabled && memberId != null;

  return useQuery({
    enabled: canFetch,
    queryKey: memberId != null ? badgeKeys.member(memberId) : badgeKeys.pending(),
    queryFn: async () => {
      if (memberId == null) return [];

      try {
        const res = await getBadges({ memberId });
        return res.data;
      } catch (e) {
        throw handleApiError(e, '배지 목록을 불러오는데 실패했습니다.');
      }
    },
  });
}
