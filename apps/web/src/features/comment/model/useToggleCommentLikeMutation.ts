import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLike } from '@/features/comment/api/toggleCommentLike.client';
import type { CommentListResponse } from '@/features/comment/api/types';

export function useToggleCommentLikeMutation(postId: number, page: number, size: number) {
  const queryClient = useQueryClient();
  const key = ['comments', postId, page, size] as const;

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentListResponse>(key);

      if (previous) {
        const next: CommentListResponse = {
          ...previous,
          comments: previous.comments.map((comment) => {
            if (comment.id !== commentId) return comment;
            const nextLiked = !comment.liked;
            const delta = nextLiked ? 1 : -1;
            return {
              ...comment,
              liked: nextLiked,
              likeCount: Math.max(0, comment.likeCount + delta),
            };
          }),
        };
        queryClient.setQueryData(key, next);
      }

      return { previous };
    },
    onSuccess: (res, commentId) => {
      const nextLiked = res.data.liked;
      const current = queryClient.getQueryData<CommentListResponse>(key);
      if (!current) return;

      const next: CommentListResponse = {
        ...current,
        comments: current.comments.map((comment) => {
          if (comment.id !== commentId) return comment;
          const delta = nextLiked === comment.liked ? 0 : nextLiked ? 1 : -1;
          return {
            ...comment,
            liked: nextLiked,
            likeCount: Math.max(0, comment.likeCount + delta),
          };
        }),
      };

      queryClient.setQueryData(key, next);
    },
    onError: (_error, _commentId, context) => {
      console.error('[useToggleCommentLikeMutation] 좋아요 토글 실패:', _error);
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
