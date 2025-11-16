'use client';

import { useState } from 'react';
import Calendar from '@/widgets/calendar/ui/Calendar';
import { useCalendarSchedule } from '@/features/calendar/model/useCalendarSchedule';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';
// import { useRouter } from 'next/router';

export function CalendarPage() {
  // const router = useRouter();
  const [month, setMonth] = useState<Date>(new Date());
  const { data: schedules = {} } = useCalendarSchedule(month.getFullYear(), month.getMonth() + 1);

  const handleCreateSchedule = () => {
    // router.push('/home/calendar/schedule/create');
  };

  return (
    <div className="bg-background-normal h-full w-full">
      <Calendar month={month} onMonthChange={setMonth} schedules={schedules} />
      <div className="absolute right-[1.25rem] bottom-[1.25rem] z-10">
        <PostFab onClick={handleCreateSchedule} />
      </div>
    </div>
  );
}
