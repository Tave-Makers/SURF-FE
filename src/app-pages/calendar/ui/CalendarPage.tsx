'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '@/widgets/calendar/ui/Calendar';
import { useGetCalendarSchedule } from '@/features/calendar/model/useGetCalendarSchedule';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';
import { useGetValidStatus } from '@/features/auth/model/useGetValidStatus';

export function CalendarPage() {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());

  const { data: userData } = useGetValidStatus();
  const memberRole = userData?.memberRole || 'member';

  const { data: schedules = {} } = useGetCalendarSchedule(
    month.getFullYear(),
    month.getMonth() + 1,
  );

  const handleCreateSchedule = () => {
    router.push('/calendar/schedule/create');
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
}
