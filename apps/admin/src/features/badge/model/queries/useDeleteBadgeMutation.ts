import { useMutation, useQueryClient } from '@tanstack/react-query';
import { badgeQueryKeys } from './queryKeys';
import { deleteBadge } from '@/features/badge/api/deleteBadge';

export const useDeleteBadgeMutation = (badgeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!badgeId) throw new Error('INVALID_BADGE_ID');
      return deleteBadge(badgeId);
    },
    onSuccess: () => {
      if (!badgeId) return;
      queryClient.removeQueries({ queryKey: badgeQueryKeys.detail(badgeId) });
      queryClient.removeQueries({ queryKey: badgeQueryKeys.members(badgeId) });
      void queryClient.invalidateQueries({ queryKey: badgeQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useDeleteBadgeMutation] 배지 삭제 실패:', error);
    },
  });
};
