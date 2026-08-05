import { useQuery } from '@tanstack/react-query';
import { badgeQueryKeys } from './queryKeys';
import { getBadgeMembers } from '@/features/badge/api/getBadgeMembers';
import { mapBadgeAwardedMemberResDtoToAwardedMember } from '@/features/badge/model/mapper';

export const useBadgeMembersQuery = (badgeId?: number) => {
  const enabled = !!badgeId;

  return useQuery({
    queryKey: badgeQueryKeys.members(badgeId ?? 0),
    queryFn: () => getBadgeMembers(badgeId!),
    select: (data) => data.content.map(mapBadgeAwardedMemberResDtoToAwardedMember),
    enabled,
    refetchOnWindowFocus: false,
  });
};
