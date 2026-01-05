import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/deleteComment.client';
import { CommentListResponse } from '../api/types';

export function useDeleteCommentMutation(postId: number, page: number, size: number) {
  const qc = useQueryClient();
  const key = ['comments', postId, page, size] as const;

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<CommentListResponse>(key);

      qc.setQueryData<CommentListResponse>(key, (old) => {
        if (!old) return old;
        const existed = old.comments.some((c) => c.id === commentId);
        if (!existed) return old;

        const nextComments = old.comments.filter((c) => c.id !== commentId);

        return {
          ...old,
          comments: nextComments,
          totalCount: Math.max(0, old.totalCount - 1),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: key });
    },
  });
}
