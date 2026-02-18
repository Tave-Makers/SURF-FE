import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateBanner } from './deactivateBanner';
import { activateBanner } from './activateBanner';

export const useToggleBannerStatusMutation = (bannerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) =>
      isActive ? activateBanner(bannerId) : deactivateBanner(bannerId),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({ queryKey: ['banner', 'list'] });
    },
    onError: (error) => {
      console.error('[useToggleBannerStatusMutation] 배너 상태 토글 실패:', error);
    },
  });
};
