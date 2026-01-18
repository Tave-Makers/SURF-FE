import { ScheduleCategory } from '../../model/types';
import { CalendarBadge } from '@/entities/calendar/ui/CalendarBadge/CalendarBadge';

interface AnnouncementBarProps {
  title: string;
  date: string;
  category: ScheduleCategory;
  onClick?: () => void;
}

export const AnnouncementBar = ({ title, date, category, onClick }: AnnouncementBarProps) => {
  return (
    <button
      className="text-body-body9 text-foreground-normal bg-background-normal-lighter rounded-5 border-border-secondary flex h-[3.125rem] w-full items-center gap-10 border px-13 shadow-[0_0_20px_3px_rgba(0,0,0,0.04)]"
      onClick={onClick}
    >
      <div>{date}</div>
      <CalendarBadge variation={category} />
      <div>{title}</div>
    </button>
  );
};
