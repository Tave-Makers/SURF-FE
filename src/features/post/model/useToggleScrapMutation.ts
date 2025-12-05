import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleScrap } from '../api/toggleScrap';
import { PostDetail } from '@/entities/post/model/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export const useToggleScrapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, scrapped }: { postId: number; scrapped: boolean }) =>
      toggleScrap(postId, scrapped),

    // Optimistic update
    onMutate: async ({ postId, scrapped }) => {
      const queryKey = postQueryKeys.postDetail(postId);

      // 1) 기존 요청 취소
      await queryClient.cancelQueries({ queryKey });

      // 2) 이전 데이터 백업
      const prevData = queryClient.getQueryData<PostDetail>(queryKey);

      // 3) 캐시 직접 수정 → UI 즉시 반영
      queryClient.setQueryData<PostDetail | undefined>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          scrappedByMe: !scrapped,
          scrapCount: scrapped ? old.scrapCount - 1 : old.scrapCount + 1,
        };
      });

      return { prevData };
    },

    // 실패 시 롤백
    onError: (_err, variables, context) => {
      const queryKey = postQueryKeys.postDetail(variables.postId);

      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
      }
    },

    // 성공/실패 관계없이 최종 서버 상태로 동기화
    onSettled: (_data, _error, variables) => {
      const queryKey = postQueryKeys.postDetail(variables.postId);

      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
