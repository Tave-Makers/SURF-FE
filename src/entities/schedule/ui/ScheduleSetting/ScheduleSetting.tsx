import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type ScheduleTitle = '시작' | '종료';

export type ScheduleSettingProps = {
  title: ScheduleTitle;
  date: Date;
};

export function ScheduleSetting({ title, date }: ScheduleSettingProps) {
  return (
    <div className="flex w-full flex-row items-center py-7">
      <div className="text-foreground-foreground-normal text-body-body8 flex flex-1">{title}</div>

      <div className="text-foreground-foreground-quaternary text-caption-caption2 flex w-full flex-1 flex-row justify-end gap-4">
        <div>{format(date, 'yyyy년 M월 d일 (E)', { locale: ko })}</div>
        <div>{format(date, 'HH:MM', { locale: ko })}</div>
      </div>
    </div>
  );
}
