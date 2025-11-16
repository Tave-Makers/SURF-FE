import type { DayButtonProps } from 'react-day-picker';
import { format, isSameMonth } from 'date-fns';
import type { ActivityMap } from '@/entities/calendar/model/types';
import { DailyActivityBadgeList } from '@/entities/calendar/ui/DailyActivityBadgeList/DailyActivityBadgeList';

type Props = DayButtonProps & {
  displayMonth: Date;
  activityMap: ActivityMap;
  onSelect?: (d: Date) => void;
};

export function DayChipRadio({
  day,
  modifiers,
  displayMonth,
  activityMap,
  onSelect,
  ...btn
}: Props) {
  const date = day.date;
  const formatDate = format(date, 'yyyy-MM-dd');

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return <button {...btn} className="w-full" />;
  }

  const inThisMonth = isSameMonth(date, displayMonth);
  const list = activityMap[formatDate] ?? [];
  const isSelected = modifiers?.today ?? false;

  return (
    <button
      {...btn}
      onClick={(e) => {
        btn.onClick?.(e); // DayPicker 내부 선택 로직에 이벤트 전달
        onSelect?.(date); // 우리 상태 업데이트
      }}
      className={[
        'rounded-3 flex h-[5rem] w-full flex-col items-start gap-2 overflow-hidden px-2 py-1',
        isSelected ? 'bg-background-background-secondary-lighter' : inThisMonth ? '' : 'opacity-50',
      ].join(' ')}
    >
      <div className="flex w-full min-w-0 flex-col">
        <div className="text-body-body8 text-foreground-foreground-secondary-lighter flex w-full items-center justify-center py-3">
          {date.getDate()}
        </div>
        <div>
          <DailyActivityBadgeList items={list} maxVisible={2} isCurrentMonth={inThisMonth} />
        </div>
      </div>
    </button>
  );
}
