import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentCreateRequest } from '../api/types';
import { createComment } from '../api/createComment.client';

export function useCreateCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;
  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: baseKey });
    },
    onError: (error) => {
      console.error('댓글 생성 실패:', error);
    },
  });
}
