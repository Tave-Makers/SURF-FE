import { useQuery } from '@tanstack/react-query';
import { PostScheduleResponse } from '@/entities/post/api/types';
import { postApi } from '@/entities/post/api/postApi';

export function useGetPostScheduleQuery(postId: number, enabled = true) {
  return useQuery<PostScheduleResponse['data']>({
    queryKey: ['postSchedule', postId],
    queryFn: () => postApi.getPostSchedule(postId),
    enabled,
    retry: false,
  });
}
