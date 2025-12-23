'use client';

import { useQuery } from '@tanstack/react-query';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';
import { getCalendarSchedule } from '@/features/calendar/api/getCalendarSchedule';
import { mapScheduleListToScheduleMap } from './mapper';

export const useGetCalendarSchedule = (year: number, month: number) => {
  return useQuery({
    queryKey: scheduleQueryKeys.calendarScheduleList(year, month),
    queryFn: () => getCalendarSchedule({ year, month }),
    select: (data) => {
      return mapScheduleListToScheduleMap(data.scheduleResDTOList);
    },
  });
};
