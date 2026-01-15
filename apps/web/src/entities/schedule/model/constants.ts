import { ScheduleCategory } from './types';

export const SCHEDULE_CATEGORIES: { value: ScheduleCategory; label: string }[] = [
  { value: 'regular', label: '정규행사' },
  { value: 'operation', label: '운영회의' },
  { value: 'other', label: '기타일정' },
] as const;

export const CATEGORY_LABELS = SCHEDULE_CATEGORIES.reduce(
  (acc, { value, label }) => ({ ...acc, [value]: label }),
  {} as Record<ScheduleCategory, string>,
);

export const CATEGORY_MAP = SCHEDULE_CATEGORIES.reduce(
  (acc, { value, label }) => ({ ...acc, [label]: value }),
  {} as Record<string, ScheduleCategory>,
);
