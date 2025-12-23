import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getSingleSchedule } from '../api/getSingleSchedule';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';
import { SingleSchedule } from '../api/types';

export const useGetSingleSchedule = (
  scheduleId?: number,
  options?: Omit<UseQueryOptions<SingleSchedule>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: scheduleQueryKeys.scheduleDetail(scheduleId as number),
    queryFn: () => getSingleSchedule(scheduleId as number),
    ...options,
  });
};
