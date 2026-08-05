import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../api/createComment.client';
import { CommentCreateRequest } from '../api/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export function useCreateCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;
  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: baseKey });
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
    },
    onError: (error) => {
      console.error('댓글 생성 실패:', error);
    },
  });
}
