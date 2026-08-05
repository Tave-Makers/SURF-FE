import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../api/createComment.client';
import { CommentCreateRequest } from '../api/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

type PostCommentCountFields = {
  commentCount: number;
};

export function useCreateCommentMutation(postId: number) {
  const queryClient = useQueryClient();
  const baseKey = ['comments', postId, 'list'] as const;
  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onMutate: async () => {
      const detailKey = postQueryKeys.detail(postId);

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: postQueryKeys.lists() });

      const previousDetail = queryClient.getQueryData<PostCommentCountFields>(detailKey);

      queryClient.setQueryData<PostCommentCountFields>(detailKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          commentCount: old.commentCount + 1,
        };
      });

      return { previousDetail };
    },
    onError: (error, _variables, context) => {
      console.error('댓글 생성 실패:', error);
      if (context?.previousDetail) {
        queryClient.setQueryData(postQueryKeys.detail(postId), context.previousDetail);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: baseKey });
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(postId) });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() });
    },
  });
}
