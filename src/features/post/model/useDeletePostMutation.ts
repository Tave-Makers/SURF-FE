'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '@/features/post/api/deletePost';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['post', 'delete'],
    mutationFn: (postId: number) => deletePost(postId),

    onSuccess: (_, postId) => {
      // 1) 게시글 상세 캐시 제거
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(postId),
      });

      // 2) 게시글 목록 계열 invalidate
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.myPosts(),
      });

      // 3) 일정 목록 invalidate (scheduleId 없음 → 넓게)
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.lists(),
      });
    },

    onError: (error) => {
      if (error instanceof Error) {
        console.error('[Post Delete Error]', error.message);
      }
    },
  });
};
