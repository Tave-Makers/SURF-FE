import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { deleteComment } from '../api/deleteComment.client';
import type { CommentListResponse, CommentResponse } from '../api/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

const isInfiniteData = (
  data: CommentListResponse | InfiniteData<CommentListResponse>,
): data is InfiniteData<CommentListResponse> => {
  return 'pages' in data && Array.isArray(data.pages);
};

type PostCommentCountFields = {
  commentCount: number;
};

export function useDeleteCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;

  const removeComment = (comments: CommentResponse[], commentId: number) =>
    comments.filter((comment) => comment.id !== commentId);

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),

    onMutate: async (commentId) => {
      const detailKey = postQueryKeys.detail(postId);

      await queryClient.cancelQueries({ queryKey: baseKey });
      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: postQueryKeys.lists() });

      const previousAll = queryClient.getQueriesData<
        CommentListResponse | InfiniteData<CommentListResponse>
      >({ queryKey: baseKey });
      const previousDetail = queryClient.getQueryData<PostCommentCountFields>(detailKey);
      let didRemoveComment = false;

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
            didRemoveComment = true;

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
            didRemoveComment = true;
            return {
              ...data,
              comments: removeComment(data.comments, commentId),
              totalCount: Math.max(0, data.totalCount - 1),
            };
          }
          return old;
        },
      );

      if (didRemoveComment) {
        queryClient.setQueryData<PostCommentCountFields>(detailKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            commentCount: Math.max(0, old.commentCount - 1),
          };
        });
      }

      return { previousAll, previousDetail };
    },

    onError: (_err, _vars, ctx) => {
      console.error('[useDeleteCommentMutation] 댓글 삭제 실패:', _err);
      if (ctx?.previousAll) {
        ctx.previousAll.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (ctx?.previousDetail) {
        queryClient.setQueryData(postQueryKeys.detail(postId), ctx.previousDetail);
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: baseKey });
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
    },
  });
}
