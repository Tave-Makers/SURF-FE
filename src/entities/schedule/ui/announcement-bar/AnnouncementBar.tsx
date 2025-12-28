import { ActivityCategory } from '@/entities/calendar/model/types';
import { formatMonthDay } from '@/shared/utils/date';
import { CalendarBadge } from '@/entities/calendar/ui/CalendarBadge/CalendarBadge';

interface AnnouncementBarProps {
  title: string;
  date: Date;
  category: ActivityCategory;
  onClick?: () => void;
}

export const AnnouncementBar = ({ title, date, category, onClick }: AnnouncementBarProps) => {
  return (
    <button
      className="text-body-body9 text-foreground-normal bg-background-normal-lighter rounded-5 border-border-secondary flex h-[3.125rem] w-full items-center gap-10 border px-13 shadow-[0_0_20px_3px_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      <div>{formatMonthDay(date)}</div>
      <CalendarBadge variation={category} />
      <div>{title}</div>
    </button>
  );
};
