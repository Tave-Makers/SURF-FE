import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { deleteComment } from '../api/deleteComment.client';
import type { CommentListResponse, CommentResponse } from '../api/types';

const isInfiniteData = (
  data: CommentListResponse | InfiniteData<CommentListResponse>,
): data is InfiniteData<CommentListResponse> => {
  return 'pages' in data && Array.isArray(data.pages);
};

export function useDeleteCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;

  const removeComment = (comments: CommentResponse[], commentId: number) =>
    comments.filter((comment) => comment.id !== commentId);

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: baseKey });

      const previousAll = queryClient.getQueriesData<
        CommentListResponse | InfiniteData<CommentListResponse>
      >({ queryKey: baseKey });

      queryClient.setQueriesData<CommentListResponse | InfiniteData<CommentListResponse>>(
        { queryKey: baseKey },
        (old) => {
          if (!old) return old;

          if (isInfiniteData(old)) {
            const data = old;
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

          if ('comments' in old) {
            const data = old;
            const existed = data.comments.some((c) => c.id === commentId);
            if (!existed) return data;
            return {
              ...data,
              comments: removeComment(data.comments, commentId),
              totalCount: Math.max(0, data.totalCount - 1),
            };
          }
          return old;
        },
      );

      return { previousAll };
    },

    onError: (_err, _vars, ctx) => {
      console.error('[useDeleteCommentMutation] 댓글 삭제 실패:', _err);
      if (ctx?.previousAll) {
        ctx.previousAll.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: baseKey });
    },
  });
}
