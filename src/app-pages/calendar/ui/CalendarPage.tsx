'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '@/widgets/calendar/ui/Calendar';
import { useGetCalendarSchedule } from '@/features/calendar/model/useGetCalendarSchedule';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';
import { useGetValidStatus } from '@/features/auth/model/useGetValidStatus';
import { PAGE_ROUTES } from '@/shared/config/path';

export function CalendarPage() {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());

  const { data: userData, isLoading, isError } = useGetValidStatus();
  const memberRole = userData?.memberRole || 'member';

  if (isError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch user status');
    }
  }

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
        <Calendar month={month} onMonthChange={setMonth} schedules={schedules} />
      </div>

      {!isLoading && memberRole !== 'member' && (
        <div className="absolute right-15 bottom-15 z-50">
          <PostFab onClick={handleCreateSchedule} />
        </div>
      )}
    </div>
  );
}
