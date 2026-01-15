import { useQuery } from '@tanstack/react-query';
import { getPostLikes } from '../api/getPostLikes';
import { LikedUser } from '@/entities/post/api/types';

export function useGetPostLikesQuery(postId: number, enabled = true) {
  return useQuery<LikedUser[]>({
    queryKey: ['postLikes', postId],
    queryFn: () => getPostLikes(postId),
    enabled,
  });
}
