'use client';

import { useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DayButtonProps, NavProps, MonthProps } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
// import { useRouter } from 'next/navigation';

import { MonthNavigator } from '@/entities/calendar/ui/MonthNavigator/MonthNavigator';
import { DayChipRadio } from '@/entities/calendar/ui/DayChipRadio/DayChipRadio';
import { EventDateCard } from '@/entities/calendar/ui/EventDateCard/EventDateCard';
import type { ActivityMap } from '@/entities/calendar/model/types';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { format } from 'date-fns';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { ensureUtcDate } from '@/features/schedule/lib/ensureUtcDate';

/**
 * calendarClassNames: DayPicker 컴포넌트의 클래스 네임 커스터마이징 객체
 * 각 키는 DayPicker의 내부 요소에 대응하며, 값은 해당 요소에 적용할 클래스 네임입니다.
 * root: 최상위 컨테이너
 * months: 월들 컨테이너
 * month: 개별 월 그리드
 * month_grid: 월 그리드 컨테이너
 * week: 주 그리드
 * cell: 날짜 셀
 * day: 날짜 버튼
 * month_caption: 월 제목 숨기기
 * tfoot: 푸터 숨기기
 * weekdays: 요일 행 그리드
 * weekday: 요일 셀
 */

const calendarClassNames = {
  root: 'w-full',
  months: 'w-full justify-center items-center',
  month: 'grid grid-cols-7',
  month_grid:
    'block flex flex-col w-full rounded-5 px-3 pb-10 bg-background-normal shadow-[0_0_30px_0_rgba(0,0,0,0.05)]',
  week: 'grid grid-cols-7 px-3',
  cell: 'min-w-0',
  day: 'w-full min-w-0',
  month_caption: 'hidden',
  tfoot: 'hidden',
  weekdays: 'flex flex-1 grid grid-cols-7',
  weekday:
    'flex-1 min-w-[2.81rem] p-10 text-center text-body-body9 text-foreground-secondary-lighter',
} as const;

type CalendarProps = {
  month: Date;
  onMonthChange: (date: Date) => void;
  schedules: ActivityMap;
};

export default function Calendar({ month, onMonthChange, schedules }: CalendarProps) {
  // const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const memberRole = useAuthStore((state) => state.memberRole) || 'member';

  // 날짜 선택 핸들러
  const handleDaySelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDay(date);
    onMonthChange(date);
  };

  // DayPicker의 DayButton 커스텀 컴포넌트
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
    <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto pt-10 pb-15">
      <div className="flex min-h-0 flex-1 items-center justify-center px-10">
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
                scheduleId={_ev.id}
                title={_ev.title}
                category={_ev.category}
                mode="calendar"
                startDate={ensureUtcDate(_ev.startDate)}
                endDate={ensureUtcDate(_ev.endDate)}
                location={_ev.location || '미정'}
                hasNotice={_ev.hasNotice}
                postId={_ev.postId}
                isAdmin={memberRole !== 'member' && memberRole !== null}
                // onClickCard={() => router.push(`/board/${_ev.boardId}/post/${_ev.postId}`)}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
