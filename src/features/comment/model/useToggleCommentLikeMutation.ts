import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLike } from '@/features/comment/api/toggleCommentLike.client';

export function useToggleCommentLikeMutation(postId: number, page: number, size: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['comments', postId, page, size] });
    },
  });
}
