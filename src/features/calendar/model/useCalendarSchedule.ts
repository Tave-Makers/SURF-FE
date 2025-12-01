'use client';

import { useQuery } from '@tanstack/react-query';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';
import { getCalendarSchedule } from '@/features/calendar/api/getCalendarSchedule';
import { mapScheduleListToScheduleMap } from './mapper';

export const useCalendarSchedule = (year: number, month: number) => {
  return useQuery({
    queryKey: scheduleQueryKeys.scheduleList(year, month),
    queryFn: () => getCalendarSchedule({ year, month }),
    select: (data) => {
      return mapScheduleListToScheduleMap(data.scheduleResDTOList);
    },
  });
};
