'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from '@/widgets/calendar/ui/Calendar';
import { useCalendarSchedule } from '@/features/calendar/model/useCalendarSchedule';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';

export function CalendarPage() {
  const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());
  const { data: schedules = {} } = useCalendarSchedule(month.getFullYear(), month.getMonth() + 1);

  const handleCreateSchedule = () => {
    router.push('/home/calendar/schedule/create');
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <Calendar month={month} onMonthChange={setMonth} schedules={schedules} />
      </div>

      <div className="absolute right-15 bottom-15 z-50">
        <PostFab onClick={handleCreateSchedule} />
      </div>
    </div>
  );
}
