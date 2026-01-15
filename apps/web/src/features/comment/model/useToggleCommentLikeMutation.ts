import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleCommentLike } from '@/features/comment/api/toggleCommentLike.client';
import type { CommentListResponse } from '@/features/comment/api/types';

export function useToggleCommentLikeMutation(postId: number, page: number, size: number) {
  const qc = useQueryClient();
  const key = ['comments', postId, page, size] as const;

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<CommentListResponse>(key);

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
        qc.setQueryData(key, next);
      }

      return { previous };
    },
    onSuccess: (res, commentId) => {
      const nextLiked = res.data.liked;
      const current = qc.getQueryData<CommentListResponse>(key);
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

      qc.setQueryData(key, next);
    },
    onError: (_error, _commentId, context) => {
      if (context?.previous) {
        qc.setQueryData(key, context.previous);
      }
    },
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: key });
    },
  });
}
