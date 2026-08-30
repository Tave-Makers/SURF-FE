import { useQuery } from '@tanstack/react-query';
import { fetchComment } from '@/features/comment/api/fetchComment.client';
import type { CommentResponse } from '@/features/comment/api/types';

export function useCommentQuery(commentId: number | null, enabled = true) {
  return useQuery<CommentResponse>({
    queryKey: ['comments', 'detail', commentId],
    queryFn: async () => {
      const response = await fetchComment(commentId as number);
      return response.data;
    },
    enabled: enabled && commentId !== null,
  });
}
