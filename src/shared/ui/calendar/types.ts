export type ActivityType = 'official' | 'operation' | 'other';

export interface DailyActivity {
  id: string;
  title: string;
  type: ActivityType;
}

export type ActivityMap = Record<string, DailyActivity[]>;
