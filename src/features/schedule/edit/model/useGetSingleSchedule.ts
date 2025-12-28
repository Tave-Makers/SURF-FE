import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSingleSchedule } from '../api/getSingleSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';
import { SingleSchedule } from '../api/types';

export const useGetSingleSchedule = (
  scheduleId?: number | null,
  options?: Omit<UseQueryOptions<SingleSchedule>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: scheduleId ? scheduleQueryKeys.detail(scheduleId) : scheduleQueryKeys.details(),
    queryFn: () => getSingleSchedule(scheduleId as number),
    enabled: !!scheduleId,
    ...options,
  });
};
