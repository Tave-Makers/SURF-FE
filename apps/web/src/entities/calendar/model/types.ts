import { ScheduleCategory } from '@/entities/schedule/model/types';

export type EventCardType = 'reservation' | 'calendar';

export type DailyActivity = {
  id: number;
  category: ScheduleCategory;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  location?: string;
  hasNotice?: boolean;
  postId?: number;
};

export type ActivityMap = Record<string, DailyActivity[]>;
