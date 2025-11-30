'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type ScheduleTitle = '시작' | '종료';

export type ScheduleSettingProps = {
  title: ScheduleTitle;
  date: Date;
  onClick?: () => void;
};

export function ScheduleSetting({ title, date, onClick }: ScheduleSettingProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-row items-center py-7 text-left"
    >
      <div className="text-foreground-foreground-normal text-body-body8 flex flex-1">{title}</div>

      <div className="text-foreground-foreground-quaternary text-caption-caption2 flex w-full flex-1 flex-row justify-end gap-4">
        <div>{format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}</div>
        <div>{format(date, 'HH:mm', { locale: ko })}</div>
      </div>
    </button>
  );
}
