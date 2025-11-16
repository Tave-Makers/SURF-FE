export type ActivityCategory = 'official' | 'operation' | 'other';
export type EventCardType = 'reservation' | 'calendar';

export type DailyActivity = {
  id: number | string;
  category: ActivityCategory;
  title: string;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string;
  hasNotice?: boolean;
  postId?: number;
};

export type ActivityMap = Record<string, DailyActivity[]>;
