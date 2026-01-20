import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchComments } from '@/features/comment/api/fetchComments.client';
import type { CommentListResponse } from '@/features/comment/api/types';
import { COMMENT_DEFAULT_PAGE } from '@/features/comment/model/constant';

export function useInfiniteCommentsQuery(postId: number, size: number, enabled = true) {
  return useInfiniteQuery<CommentListResponse>({
    queryKey: ['comments', postId, 'infinite', size],
    queryFn: async ({ pageParam = COMMENT_DEFAULT_PAGE }): Promise<CommentListResponse> => {
      const response = await fetchComments(postId, pageParam as number, size);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined;
      return COMMENT_DEFAULT_PAGE + allPages.length;
    },
    initialPageParam: COMMENT_DEFAULT_PAGE,
    enabled,
  });
}
