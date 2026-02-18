import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBanner } from './deleteBanner';

export const useDeleteBannerMutation = (bannerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBanner(bannerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner', 'list'] });
    },
    onError: (error) => {
      console.error('[useDeleteBannerMutation] 배너 삭제 실패:', error);
    },
  });
};
