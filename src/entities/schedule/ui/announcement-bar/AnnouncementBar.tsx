import { ActivityCategory } from '@/entities/calendar/model/types';
import { formatMonthDay } from '@/shared/utils/date';
import CalenderBadge from '@/entities/calendar/ui/CalendarBadge';

interface AnnouncementBarProps {
  title: string;
  date: Date;
  category: ActivityCategory;
}

export const AnnouncementBar = ({ title, date, category }: AnnouncementBarProps) => {
  return (
    <div className="text-body-body9 text-foreground-foreground-normal flex h-[50px] w-full items-center justify-center gap-10 px-13">
      <div>{formatMonthDay(date)}</div>
      <CalenderBadge variation={category} />
      <div>{title}</div>
    </div>
  );
};
