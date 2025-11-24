import { useQuery } from '@tanstack/react-query';
import { getSingleSchedule } from '../api/getSingleSchedule';

export const useGetSingleSchedule = (scheduleId?: number, mode?: 'create' | 'edit') => {
  return useQuery({
    queryKey: ['calendar-schedule', scheduleId],
    queryFn: () => getSingleSchedule(scheduleId as number),
    select: (data) => data,
    enabled: mode === 'edit' && !!scheduleId,
  });
};
