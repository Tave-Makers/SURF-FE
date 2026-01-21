import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { deleteComment } from '../api/deleteComment.client';
import type { CommentListResponse, CommentResponse } from '../api/types';

export function useDeleteCommentMutation(postId: number) {
  const qc = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;

  const removeComment = (comments: CommentResponse[], commentId: number) =>
    comments.filter((comment) => comment.id !== commentId);

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),

    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: baseKey });

      const previousAll = qc.getQueriesData<
        CommentListResponse | InfiniteData<CommentListResponse>
      >({ queryKey: baseKey });

      qc.setQueriesData({ queryKey: baseKey }, (old) => {
        if (!old) return old;

        if ('pages' in (old as InfiniteData<CommentListResponse>)) {
          const data = old as InfiniteData<CommentListResponse>;
          const hasComment = data.pages.some((pageData) =>
            pageData.comments.some((c) => c.id === commentId),
          );
          if (!hasComment) return data;

          return {
            ...data,
            pages: data.pages.map((pageData) => {
              return {
                ...pageData,
                comments: removeComment(pageData.comments, commentId),
                totalCount: Math.max(0, pageData.totalCount - 1),
              };
            }),
          };
        }

        const data = old as CommentListResponse;
        const existed = data.comments.some((c) => c.id === commentId);
        if (!existed) return data;
        return {
          ...data,
          comments: removeComment(data.comments, commentId),
          totalCount: Math.max(0, data.totalCount - 1),
        };
      });

      return { previousAll };
    },

    onError: (_err, _vars, ctx) => {
      console.error('[useDeleteCommentMutation] 댓글 삭제 실패:', _err);
      if (ctx?.previousAll) {
        ctx.previousAll.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },

    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: baseKey });
    },
  });
}
