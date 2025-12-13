import { useQuery } from '@tanstack/react-query';
import { PostScheduleResponse } from '@/entities/post/api/types';
import { getPostSchedule } from '../api/getPostSchedule';

export function useGetPostScheduleQuery(postId: number, enabled = true) {
  return useQuery<PostScheduleResponse['data']>({
    queryKey: ['postSchedule', postId],
    queryFn: () => getPostSchedule(postId),
    enabled,
    retry: false,
  });
}
