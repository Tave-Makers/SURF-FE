import { useQuery } from '@tanstack/react-query';
import { fetchComments } from '@/features/comment/api/fetchComments.client';

export function useGetCommentsQuery(postId: number, page: number, size: number, enabled = true) {
  return useQuery({
    queryKey: ['comments', postId, page, size],
    queryFn: async () => {
      const response = await fetchComments(postId, page, size);
      return response.data;
    },
    enabled: enabled && Number.isFinite(postId),
  });
}
