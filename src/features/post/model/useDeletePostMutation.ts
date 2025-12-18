'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/features/post/api/deletePost';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),

    onSuccess: (_, postId) => {
      // 1) 상세 페이지 캐시 invalidate
      void queryClient.removeQueries({
        queryKey: postQueryKeys.postDetail(postId),
      });

      // 2) 전체 post 관련 쿼리 invalidate
      // TODO : 새로고침을 해야 캐시 무효화가 되는 오류 해결하기
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.all,
        exact: false,
      });
    },

    onError: (error) => {
      console.error('[Post Delete Error]', error);
    },
  });
};
