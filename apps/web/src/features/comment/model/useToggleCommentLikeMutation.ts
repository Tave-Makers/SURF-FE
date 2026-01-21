import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { toggleCommentLike } from '@/features/comment/api/toggleCommentLike.client';
import type { CommentListResponse, CommentResponse } from '@/features/comment/api/types';

export function useToggleCommentLikeMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId] as const;

  const toggleLike = (comments: CommentResponse[], commentId: number) =>
    comments.map((comment) => {
      if (comment.id !== commentId) return comment;
      const nextLiked = !comment.liked;
      const delta = nextLiked ? 1 : -1;
      return {
        ...comment,
        liked: nextLiked,
        likeCount: Math.max(0, comment.likeCount + delta),
      };
    });

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: baseKey });
      const previousAll = queryClient.getQueriesData<
        CommentListResponse | InfiniteData<CommentListResponse>
      >({ queryKey: baseKey });

      queryClient.setQueriesData({ queryKey: baseKey }, (old) => {
        if (!old) return old;

        if ('pages' in (old as InfiniteData<CommentListResponse>)) {
          const data = old as InfiniteData<CommentListResponse>;
          return {
            ...data,
            pages: data.pages.map((pageData) => ({
              ...pageData,
              comments: toggleLike(pageData.comments, commentId),
            })),
          };
        }

        const data = old as CommentListResponse;
        return { ...data, comments: toggleLike(data.comments, commentId) };
      });

      return { previousAll };
    },
    onSuccess: () => {
      // 낙관적 업데이트가 성공하면 추가 fetch 불필요
    },
    onError: (_error, _commentId, context) => {
      console.error('[useToggleCommentLikeMutation] 좋아요 토글 실패:', _error);
      if (context?.previousAll) {
        context.previousAll.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      // 에러 시에만 서버 상태 동기화
      void queryClient.invalidateQueries({ queryKey: baseKey });
    },
  });
}
