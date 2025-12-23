import { useQuery } from '@tanstack/react-query';
import { PostScheduleResponse } from '@/entities/schedule/post-schedule/api/types';
import { postScheduleApi } from '@/entities/schedule/post-schedule/api/postScheduleApi';

export function useGetPostScheduleQuery(postId: number, enabled = true) {
  return useQuery<PostScheduleResponse['data']>({
    queryKey: ['postSchedule', postId],
    queryFn: () => postScheduleApi.getPostSchedule(postId),
    enabled,
    retry: false,
  });
}
