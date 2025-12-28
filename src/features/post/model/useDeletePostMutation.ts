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
      queryClient.removeQueries({
        queryKey: postQueryKeys.detail(postId),
      });

      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      });

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
