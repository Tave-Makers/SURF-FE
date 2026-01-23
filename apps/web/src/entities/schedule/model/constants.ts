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

// 유효한 value들만 모은 배열 ( ['regular', 'operation', 'other'] )
const VALID_CATEGORY_VALUES = SCHEDULE_CATEGORIES.map((c) => c.value);

/** 서버 데이터가 유효한 ScheduleCategory인지 확인하는 가드 함수 */
export const getValidCategory = (value: string | undefined): ScheduleCategory => {
  if (value && VALID_CATEGORY_VALUES.includes(value as ScheduleCategory)) {
    return value as ScheduleCategory;
  }
  return 'regular'; // 유효하지 않거나 없으면 기본값 반환
};
