import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike } from '../api/toggleLike';
import { PostDetail } from '@/entities/post/model/types';

export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      toggleLike(postId, liked),

    // optimistic update
    onMutate: async ({ postId, liked }) => {
      // 1) 기존에 진행 중이던 동일 쿼리의 요청 취소
      await queryClient.cancelQueries({ queryKey: ['postDetail', postId] });

      // 2) rollback을 위해 이전 데이터 백업
      const prevData = queryClient.getQueryData(['postDetail', postId]);

      // 3) 캐시를 직접 수정하여 UI를 즉시 업데이트
      queryClient.setQueryData(['postDetail', postId], (old: PostDetail) => {
        if (!old) return old;

        return {
          ...old,
          likedByMe: !liked,
          likeCount: liked ? old.likeCount - 1 : old.likeCount + 1,
        };
      });

      // rollback용 데이터 반환
      return { prevData };
    },

    // optimistic update 실패 시 — 롤백 처리
    onError: (_err, variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(['postDetail', variables.postId], context.prevData);
      }
    },

    // 성공/실패 여부와 관계없이 최신 서버 상태로 동기화
    onSettled: (_data, _error, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['postDetail', variables.postId],
      });
    },
  });
};
