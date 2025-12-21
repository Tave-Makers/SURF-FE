'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const containerStyle = 'flex w-full flex-row items-center justify-between py-7 text-left';
const titleStyle = 'text-foreground-normal text-body-body9 flex shrink-0';
const dateStyle =
  'text-foreground-quaternary text-caption-caption2 flex w-full flex-row justify-end gap-4';

type ScheduleTitle = '시작' | '종료';

interface ScheduleSettingProps {
  title: ScheduleTitle;
  date: Date;
  onClick?: () => void;
}

export function ScheduleSetting({ title, date, onClick }: ScheduleSettingProps) {
  return (
    <button type="button" onClick={onClick} className={containerStyle}>
      <div className={titleStyle}>{title}</div>

      <div className={dateStyle}>
        <div>{format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}</div>
        <div>{format(date, 'HH:mm', { locale: ko })}</div>
      </div>
    </button>
  );
}
