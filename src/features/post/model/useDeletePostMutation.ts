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
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.postDetail(postId),
      });

      // 2) 전체 post 관련 쿼리 invalidate
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
