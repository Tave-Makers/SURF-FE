export type ActivityType = 'official' | 'operation' | 'other';

export interface DailyActivity {
  id: string;
  title: string;
  type: ActivityType;
  startDate?: Date;
  endDate?: Date;
  place?: string;
}

export type ActivityMap = Record<string, DailyActivity[]>;
