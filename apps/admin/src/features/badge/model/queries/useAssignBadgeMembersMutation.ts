import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignBadgeMembers } from '@/features/badge/api/assignBadge';
import { AssignBadgeMembersRequest } from '@/features/badge/api/types';
import { badgeQueryKeys } from './queryKeys';

export const useAssignBadgeMembersMutation = (badgeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignBadgeMembersRequest) => {
      if (!badgeId) throw new Error('INVALID_BADGE_ID');
      return assignBadgeMembers(badgeId, data);
    },
    onSuccess: () => {
      if (!badgeId) return;
      void queryClient.invalidateQueries({ queryKey: badgeQueryKeys.members(badgeId) });
    },
    onError: (error) => {
      console.error('[useAssignBadgeMembersMutation] 배지 부여 실패:', error);
    },
  });
};
