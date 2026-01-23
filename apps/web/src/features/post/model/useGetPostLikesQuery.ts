import { useQuery } from '@tanstack/react-query';
import { getPostLikes } from '../api/getPostLikes';
import { LikedUser } from '@/entities/post/api/types';
import { postQueryKeys } from '@/entities/post/api/queryKeys';

export function useGetPostLikesQuery(postId: number, enabled = true) {
  return useQuery<LikedUser[]>({
    queryKey: postQueryKeys.likeUsers(postId),
    queryFn: () => getPostLikes(postId),
    enabled,
  });
}
