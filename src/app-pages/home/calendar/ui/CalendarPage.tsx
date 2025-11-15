'use client';

import { useState } from 'react';
import Calendar from '@/widgets/calendar/ui/Calendar';
import { useCalendarSchedule } from '@/features/calendar/model/useCalendarSchedule';

export function CalendarPage() {
  const [month, setMonth] = useState<Date>(new Date());
  const { data: schedules = {} } = useCalendarSchedule(month.getFullYear(), month.getMonth() + 1);

  return (
    <div className="bg-background-normal h-full w-full">
      <Calendar month={month} onMonthChange={setMonth} schedules={schedules} />
    </div>
  );
}
