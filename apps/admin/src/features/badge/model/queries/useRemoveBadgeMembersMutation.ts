import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeBadgeMembers } from '@/features/badge/api/removeBadgeMember';
import { RemoveBadgeMembersRequest } from '@/features/badge/api/types';
import { badgeQueryKeys } from './queryKeys';

export const useRemoveBadgeMembersMutation = (badgeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveBadgeMembersRequest) => {
      if (!badgeId) throw new Error('INVALID_BADGE_ID');
      return removeBadgeMembers(badgeId, data);
    },
    onSuccess: () => {
      if (!badgeId) return;
      void queryClient.invalidateQueries({ queryKey: badgeQueryKeys.members(badgeId) });
    },
    onError: (error) => {
      console.error('[useRemoveBadgeMembersMutation] 배지 멤버 회수 실패:', error);
    },
  });
};
