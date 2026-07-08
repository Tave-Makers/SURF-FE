import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBadge } from '@/features/badge/api/updateBadge';
import { UpdateBadgeRequest } from '@/features/badge/api/types';
import { badgeQueryKeys } from './queryKeys';

export const useUpdateBadgeMutation = (badgeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBadgeRequest) => {
      if (!badgeId) throw new Error('INVALID_BADGE_ID');
      return updateBadge(badgeId, data);
    },
    onSuccess: () => {
      if (!badgeId) return;
      void queryClient.invalidateQueries({ queryKey: badgeQueryKeys.list() });
      void queryClient.invalidateQueries({ queryKey: badgeQueryKeys.detail(badgeId) });
    },
    onError: (error) => {
      console.error('[useUpdateBadgeMutation] 배지 수정 실패:', error);
    },
  });
};
