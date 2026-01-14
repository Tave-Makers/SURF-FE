import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentCreateRequest } from '../api/types';
import { createComment } from '../api/createComment.client';

export function useCreateCommentMutation(postId: number, page: number, size: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['comments', postId, page, size] });
    },
  });
}
