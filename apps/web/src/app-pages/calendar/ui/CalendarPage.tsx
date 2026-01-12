'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useGetCalendarSchedule } from '@/features/calendar/model/useGetCalendarSchedule';
import { PAGE_ROUTES } from '@/shared/config/path';
import { Calendar } from '@/widgets/calendar/ui/Calendar';

export const CalendarPage = () => {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());

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
        <Calendar month={month} onMonthChange={setMonth} schedules={schedules} />
      </div>

      {memberRole !== 'member' && (
        <div className="absolute right-15 bottom-15 z-50">
          <PostFab onClick={handleCreateSchedule} />
        </div>
      )}
    </div>
  );
};
