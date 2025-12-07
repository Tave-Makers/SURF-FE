import { useQuery } from '@tanstack/react-query';
import { getSingleSchedule } from '../api/getSingleSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export const useGetSingleSchedule = (scheduleId?: number, mode?: 'create' | 'edit') => {
  return useQuery({
    queryKey: scheduleQueryKeys.detail(scheduleId as number),
    queryFn: () => getSingleSchedule(scheduleId as number),
    enabled: mode === 'edit' && !!scheduleId,
  });
};
