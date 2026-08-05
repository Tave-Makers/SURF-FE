import { useQuery } from '@tanstack/react-query';
import { getPostLikes } from '../api/getPostLikes';
import { postQueryKeys } from '@/entities/post/api/queryKeys';
import { LikedUser } from '@/entities/post/api/types';

export function useGetPostLikesQuery(postId: number, enabled = true) {
  return useQuery<LikedUser[]>({
    queryKey: postQueryKeys.likeUsers(postId),
    queryFn: () => getPostLikes(postId),
    enabled,
  });
}
