import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBanner } from '../api/createBanner';
import { CreateBannerRequest, UpdateBannerRequest } from '../api/types';
import { deleteBanner } from '../api/deleteBanner';
import { activateBanner } from '../api/activateBanner';
import { deactivateBanner } from '../api/deactivateBanner';
import { updateBanner } from '../api/updateBanner';
import { bannerQueryKeys } from '../api/queryKeys';
import { reorderBanner } from '../api/reorderBanner';

// 홈 배너 생성 Mutation
export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerRequest) => createBanner(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useCreateBannerMutation] 배너 생성 실패:', error);
    },
  });
};

// 홈 배너 삭제 Mutation
export const useDeleteBannerMutation = (bannerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteBanner(bannerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useDeleteBannerMutation] 배너 삭제 실패:', error);
    },
  });
};

// 홈 배너 활성화/비활성화 토글 Mutation
export const useToggleBannerStatusMutation = (bannerId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) =>
      isActive ? activateBanner(bannerId) : deactivateBanner(bannerId),
    onSuccess: async (_) => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useToggleBannerStatusMutation] 배너 상태 토글 실패:', error);
    },
  });
};

// 홈 배너 업데이트 Mutation
export const useUpdateBannerMutation = (bannerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBannerRequest) => updateBanner(bannerId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useUpdateBannerMutation] 배너 업데이트 실패:', error);
    },
  });
};

export const useReorderBannerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { orderedIds: number[] }) => reorderBanner(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
    onError: (error) => {
      console.error('[useReorderBannerMutation] 배너 순서 변경 실패:', error);
    },
  });
};
