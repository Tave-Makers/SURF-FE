import { useQuery } from '@tanstack/react-query';
import { mapBadgeResDtoToBadge } from '../mapper';
import { badgeQueryKeys } from './queryKeys';
import { getBadgeDetail } from '@/features/badge/api/getBadgeDetail';

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
