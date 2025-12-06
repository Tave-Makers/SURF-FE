import { ActivityCategory } from '@/entities/calendar/model/types';
import { formatMonthDay } from '@/shared/utils/date';
import { CalendarBadge } from '@/entities/calendar/ui/CalendarBadge/CalendarBadge';

interface AnnouncementBarProps {
  title: string;
  date: Date;
  category: ActivityCategory;
}

export const AnnouncementBar = ({ title, date, category }: AnnouncementBarProps) => {
  return (
    <div className="text-body-body9 text-foreground-foreground-normal bg-background-background-normal-lighter rounded-5 flex h-[50px] w-full items-center gap-10 px-13">
      <div>{formatMonthDay(date)}</div>
      <CalendarBadge variation={category} />
      <div>{title}</div>
    </div>
  );
};
