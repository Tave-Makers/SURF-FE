import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';
import { PostDetail } from '@/entities/post/model/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),

    // optimistic update
    onMutate: async ({ postId, liked }) => {
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
          likedByMe: !liked,
          likeCount: liked ? old.likeCount - 1 : old.likeCount + 1,
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

    // 성공/실패 상관없이 최종 서버 상태로 동기화
    onSettled: (_data, _error, variables) => {
      const queryKey = postQueryKeys.postDetail(variables.postId);

      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
