import { useQuery } from '@tanstack/react-query';
import { getBadgeDetail } from '@/features/badge/api/getBadgeDetail';

import { badgeQueryKeys } from './queryKeys';
import { mapBadgeResDtoToBadge } from '../mapper';

export const useBadgeDetailQuery = (badgeId?: number) => {
  const enabled = !!badgeId;

  return useQuery({
    queryKey: badgeQueryKeys.detail(badgeId ?? 0),
    queryFn: () => getBadgeDetail(badgeId!),
    select: mapBadgeResDtoToBadge,
    enabled,
    refetchOnWindowFocus: false,
  });
};
