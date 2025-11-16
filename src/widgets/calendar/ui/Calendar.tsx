'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DayButtonProps, NavProps, MonthProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

import { MonthNavigator } from '@/entities/calendar/ui/MonthNavigator/MonthNavigator';
import { DayChipRadio } from '../../../entities/calendar/ui/DayChipRadio/DayChipRadio';
import { EventDateCard } from '@/entities/calendar/ui/EventDateCard/EventDateCard';
import type { ActivityMap } from '@/entities/calendar/model/types';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { format } from 'date-fns';

type CalendarProps = {
  month: Date;
  onMonthChange: (date: Date) => void;
  schedules: ActivityMap;
};

const calendarClassNames = {
  root: 'w-full',
  months: 'w-full justify-center items-center',
  month: 'grid grid-cols-7',
  month_grid:
    'block flex flex-col w-full rounded-5 px-3 pb-10 bg-background-background-normal shadow-[0_0_30px_0_rgba(0,0,0,0.05)]',
  week: 'grid grid-cols-7 px-3',
  cell: 'min-w-0',
  day: 'w-full min-w-0',
  month_caption: 'hidden',
  tfoot: 'hidden',
  weekdays: 'flex flex-1 grid grid-cols-7',
  weekday:
    'flex-1 min-w-[3.12rem] p-10 text-center text-body-body8 text-foreground-foreground-secondary-lighter',
} as const;

export default function Calendar({ month, onMonthChange, schedules }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDay(date);
    onMonthChange(date);
  };

  const DayBtn = useMemo(() => {
    function DayButton(props: DayButtonProps) {
      return (
        <div className="h-full w-full">
          <DayChipRadio
            {...props}
            displayMonth={month}
            activityMap={schedules}
            onSelect={(date) => {
              if (date instanceof Date) {
                setSelectedDay(date);
              }
            }}
          />
        </div>
      );
    }
    return DayButton;
  }, [month, schedules]);

  // 월 네비게이터 컴포넌트
  const NavigatorComponent = ({
    onPreviousClick: _prevClick,
    onNextClick: _nextClick,
  }: NavProps) => (
    <div className="pb-10">
      <MonthNavigator month={month} onChange={onMonthChange} />
    </div>
  );

  // 월 그리드 래퍼 컴포넌트
  const MonthComponent = ({ children }: MonthProps) => <div className="w-full">{children}</div>;

  const formatDate = format(selectedDay, 'yyyy-MM-dd');
  const selectedItems = selectedDay ? (schedules[formatDate] ?? []) : [];

  return (
    <div className="flex flex-1 flex-col gap-10 pt-10">
      <div className="flex flex-1 items-center justify-center px-10">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={onMonthChange}
          selected={selectedDay}
          onSelect={handleDaySelect}
          locale={ko}
          showOutsideDays
          classNames={calendarClassNames}
          components={{
            Nav: NavigatorComponent,
            Month: MonthComponent,
            DayButton: DayBtn,
          }}
        />
      </div>

      <div className="px-13">
        {selectedDay && (
          <EventDateCard
            date={selectedDay}
            items={selectedItems}
            renderItem={(_ev) => (
              <EventCard
                id={_ev.id}
                title={_ev.title}
                category={_ev.category}
                mode="calendar"
                startDate={_ev.startDate || null}
                endDate={_ev.endDate || null}
                location={_ev.location || '미정'}
                hasNotice={_ev.hasNotice}
                postId={_ev.postId}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
