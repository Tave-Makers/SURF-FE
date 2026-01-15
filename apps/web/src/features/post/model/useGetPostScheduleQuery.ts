import { useQuery } from '@tanstack/react-query';
import { PostScheduleResponse } from '@/entities/post/api/types';
import { postApi } from '@/entities/post/api/postApi';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export function useGetPostScheduleQuery(
  postId: number,
  scheduleId: number | undefined | null,
  enabled = true,
) {
  return useQuery<PostScheduleResponse['data']>({
    queryKey: scheduleQueryKeys.detail(scheduleId!),
    queryFn: () => postApi.getPostSchedule(postId),
    enabled: !!scheduleId && enabled,
    retry: false,
  });
}
