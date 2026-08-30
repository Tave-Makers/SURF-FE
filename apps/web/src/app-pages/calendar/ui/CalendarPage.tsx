'use client';

import { Fab } from '@surf/ui/fab';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { trackCalendarEvent } from '@/features/calendar/lib/trackCalendarEvent';
import { CALENDAR_EVENTS } from '@/features/calendar/model/constants';
import { useGetCalendarSchedule } from '@/features/calendar/model/useGetCalendarSchedule';
import { usePageName } from '@/shared/analytics/lib/getPageName';
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

  const trackRef = useRef(false);
  const pageName = usePageName();

  useEffect(() => {
    if (trackRef.current) return;
    trackRef.current = true;
    trackCalendarEvent(CALENDAR_EVENTS.PAGE_VIEW, { page_name: pageName });
  }, [pageName]);

  const handleDateClick = (date: Date) => {
    trackCalendarEvent(CALENDAR_EVENTS.CALENDAR_DATE_CLICK, {
      selected_date: format(date, 'yyyy-MM-dd'),
    });
  };

  const handleEventClick = (scheduleId: number, postId?: number) => {
    trackCalendarEvent(CALENDAR_EVENTS.EVENT_CARD_CLICK, {
      event_id: scheduleId,
      ...(postId && { post_id: postId }),
    });
  };

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
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
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
