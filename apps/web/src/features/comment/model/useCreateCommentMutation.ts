import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentCreateRequest } from '../api/types';
import { createComment } from '../api/createComment.client';

export function useCreateCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error) => {
      console.error('댓글 생성 실패:', error);
    },
  });
}
