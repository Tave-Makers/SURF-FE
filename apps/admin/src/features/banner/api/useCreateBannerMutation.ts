import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBanner } from './createBanner';
import { CreateBannerRequest } from './types';

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerRequest) => createBanner(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner', 'list'] });
    },
    onError: (error) => {
      console.error('[useCreateBannerMutation] 배너 생성 실패:', error);
    },
  });
};
