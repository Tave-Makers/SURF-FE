'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DayButtonProps, NavProps, MonthProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

import { MonthNavigator } from '@/entities/calendar/ui/MonthNavigator';
import { DayChipRadio } from '../../../entities/calendar/ui/DayChipRadio';
import { EventDateCard } from '@/entities/calendar/ui/EventDateCard';
import type { ActivityMap } from '@/entities/calendar/model/types';
import { ymd } from '@/entities/calendar/lib/utils';
import { EventCard } from '@/entities/calendar/ui/EventCard';

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

// mock 데이터. API 연동 시 삭제 예정
const mock: ActivityMap = {
  '2025-10-30': [
    {
      id: 'x1',
      title: '후반기 만남의 장소',
      type: 'official',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
    {
      id: 'x2',
      title: '회의',
      type: 'operation',
      startDate: new Date(),
      endDate: new Date(),
      place: '오프라인',
    },
    {
      id: 'x3',
      title: '후반기 만남의 장소',
      type: 'official',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
  ],
  '2025-10-31': [
    {
      id: 'x2',
      title: '회의',
      type: 'operation',
      startDate: new Date(),
      endDate: new Date(),
      place: '오프라인',
    },
    {
      id: 'x4',
      title: 'OB 네트워킹 데이',
      type: 'other',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
    {
      id: 'x5',
      title: 'OB 네트워킹 데이',
      type: 'other',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
    {
      id: 'x6',
      title: 'OB 네트워킹 데이',
      type: 'other',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
    {
      id: 'x7',
      title: 'OB 네트워킹 데이',
      type: 'other',
      startDate: new Date(),
      endDate: new Date(),
      place: '온라인',
    },
  ],
};

export default function Calendar() {
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDay(date);
    setMonth(date);
  };

  const DayBtn = useMemo(() => {
    function DayButton(props: DayButtonProps) {
      return (
        <div className="h-full w-full">
          <DayChipRadio
            {...props}
            displayMonth={month}
            activityMap={mock}
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
  }, [month]);

  // 월 네비게이터 컴포넌트
  const NavigatorComponent = ({
    onPreviousClick: _prevClick,
    onNextClick: _nextClick,
  }: NavProps) => (
    <div className="pb-10">
      <MonthNavigator month={month} onChange={setMonth} />
    </div>
  );

  // 월 그리드 래퍼 컴포넌트
  const MonthComponent = ({ children }: MonthProps) => <div className="w-full">{children}</div>;

  const selectedItems = selectedDay ? (mock[ymd(selectedDay)] ?? []) : [];

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="flex flex-1 items-center justify-center px-10">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
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
                key={_ev.id}
                title={_ev.title}
                type={_ev.type}
                mode="calendar"
                startDate={_ev.startDate}
                endDate={_ev.endDate}
                place={_ev.place || '미정'}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
