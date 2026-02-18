import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateBannerRequest } from './types';
import { updateBanner } from './updateBanner';

export const useUpdateBannerMutation = (bannerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBannerRequest) => updateBanner(bannerId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner', 'list'] });
    },
    onError: (error) => {
      console.error('[useUpdateBannerMutation] 배너 업데이트 실패:', error);
    },
  });
};
