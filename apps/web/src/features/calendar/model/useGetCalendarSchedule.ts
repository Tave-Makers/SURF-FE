'use client';

import { useQuery } from '@tanstack/react-query';
import { mapScheduleListToScheduleMap } from './mapper';
import { getCalendarSchedule } from '@/features/calendar/api/getCalendarSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export const useGetCalendarSchedule = (year: number, month: number) => {
  return useQuery({
    queryKey: scheduleQueryKeys.list({ year, month }),
    queryFn: () => getCalendarSchedule({ year, month }),
    select: (data) => {
      return mapScheduleListToScheduleMap(data.scheduleResDTOList);
    },
  });
};
