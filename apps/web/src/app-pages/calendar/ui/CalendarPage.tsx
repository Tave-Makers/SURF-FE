'use client';

import { Fab } from '@surf/ui/fab';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useGetCalendarSchedule } from '@/features/calendar/model/useGetCalendarSchedule';
import { PAGE_ROUTES } from '@/shared/config/path';
import { Calendar } from '@/widgets/calendar/ui/Calendar';

export const CalendarPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const isValidDate = !isNaN(initialDate.getTime());
  const targetDate = isValidDate ? initialDate : new Date();

  const [month, setMonth] = useState<Date>(targetDate);

  const memberRole = useAuthStore((s) => s.memberRole);

  const { data: schedules = {} } = useGetCalendarSchedule(
    month.getFullYear(),
    month.getMonth() + 1,
  );

  const handleCreateSchedule = () => {
    router.push(PAGE_ROUTES.CALENDAR.CREATE);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <Calendar
          month={month}
          onMonthChange={setMonth}
          schedules={schedules}
          initialSelectedDate={targetDate}
        />
      </div>

      {memberRole !== 'member' && (
        <div className="absolute right-15 bottom-15 z-50">
          <Fab onClick={handleCreateSchedule} />
        </div>
      )}
    </div>
  );
};
