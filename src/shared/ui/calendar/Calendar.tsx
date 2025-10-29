'use client';

import { useMemo, useState } from 'react';
import { DayPicker, type DayButtonProps, type NavProps, type MonthProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

import { MonthNavigator } from './MonthNavigator';
import { CalendarDayButton } from './CalendarDayButton';
import { SelectedDayEventsSection } from '@/shared/ui/calendar/SelectedDayEventsSection';
import type { ActivityMap } from './types';
import { ymd } from './utils';

const calendarClassNames = {
  root: 'w-full',
  months: 'w-full justify-center items-center',
  month: 'w-full px-3 pb-10',
  month_grid: 'w-full',
  month_caption: 'hidden',
  tfoot: 'hidden',
  weekday:
    'w-[3.06rem] p-10 text-center text-body-body8 text-foreground-foreground-secondary-lighter',
} as const;

// mock 데이터. API 연동 시 삭제 예정
const mock: ActivityMap = {
  '2025-10-30': [
    { id: 'x1', title: '후반기 만남의 장소', type: 'official' },
    { id: 'x2', title: '회의', type: 'operation' },
    { id: 'x3', title: '후반기 만남의 장소', type: 'official' },
  ],
  '2025-10-31': [
    { id: 'x2', title: '회의', type: 'operation' },
    { id: 'x4', title: 'OB 네트워킹 데이', type: 'other' },
    { id: 'x5', title: 'OB 네트워킹 데이', type: 'other' },
    { id: 'x6', title: 'OB 네트워킹 데이', type: 'other' },
    { id: 'x7', title: 'OB 네트워킹 데이', type: 'other' },
  ],
};

export default function Calendar() {
  const [month, setMonth] = useState<Date>(new Date(2025, 10, 30));
  const [selectedDay, setSelectedDay] = useState<Date>();

  const DayBtn = useMemo(() => {
    function DayButton(props: DayButtonProps) {
      return (
        <div className="h-full w-full">
          <CalendarDayButton
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
  const MonthComponent = ({ children }: MonthProps) => <div>{children}</div>;

  const selectedItems = selectedDay ? (mock[ymd(selectedDay)] ?? []) : [];

  return (
    <div className="flex flex-1 flex-col gap-10">
      <div className="flex flex-1 items-center justify-center px-10">
        <DayPicker
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={selectedDay}
          onSelect={setSelectedDay}
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
        <SelectedDayEventsSection
          date={selectedDay}
          items={selectedItems}
          renderItem={(_ev) => <></>} // EventCard 자리
        />
      </div>
    </div>
  );
}
