'use client';

import { format, roundToNearestMinutes } from 'date-fns';
import { ko } from 'date-fns/locale';

export type ScheduleTitle = '시작' | '종료';

export type ScheduleSettingProps = {
  title: ScheduleTitle;
  date: Date;
  onClick?: () => void;
};

export function ScheduleSetting({ title, date, onClick }: ScheduleSettingProps) {
  const roundedDate = roundToNearestMinutes(date, { nearestTo: 30 });

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-row items-center justify-between py-7 text-left"
    >
      <div className="text-foreground-normal text-body-body8 flex shrink-0">{title}</div>

      <div className="text-foreground-quaternary text-caption-caption2 flex w-full flex-row justify-end gap-4">
        <div>{format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}</div>
        <div>{format(roundedDate, 'HH:mm', { locale: ko })}</div>
      </div>
    </button>
  );
}
