import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBanner } from '../api/createBanner';
import { CreateBannerRequest, ReorderBannerRequest, UpdateBannerRequest } from '../api/types';
import { deleteBanner } from '../api/deleteBanner';
import { activateBanner } from '../api/activateBanner';
import { deactivateBanner } from '../api/deactivateBanner';
import { updateBanner } from '../api/updateBanner';
import { bannerQueryKeys } from '../api/queryKeys';
import { reorderBanner } from '../api/reorderBanner';
import { Banner } from '@/entities/banner/model/types';

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
    mutationFn: (data: ReorderBannerRequest) => reorderBanner(data),

    onMutate: async (newData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: bannerQueryKeys.list() });

      // 이전 값 스냅샷 저장
      const previousBanners = queryClient.getQueryData<Banner[]>(bannerQueryKeys.list());

      // 캐시 업데이트
      if (previousBanners) {
        queryClient.setQueryData<Banner[]>(bannerQueryKeys.list(), (old) => {
          if (!old) return [];

          // 기존 배열을 복사하여 정렬
          return [...old].sort((a, b) => {
            const indexA = newData.orderedIds.indexOf(a.id);
            const indexB = newData.orderedIds.indexOf(b.id);
            return indexA - indexB;
          });
        });
      }

      return { previousBanners };
    },

    onError: (err, _newData, context) => {
      // 에러 시 복구
      if (context?.previousBanners) {
        queryClient.setQueryData(bannerQueryKeys.list(), context.previousBanners);
      }
      console.error('순서 변경 실패:', err);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: bannerQueryKeys.list() });
    },
  });
};
