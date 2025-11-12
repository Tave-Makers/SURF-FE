import type { CategoryBadge, PostCategory } from './types';

export const POST_CATEGORY_LABEL_MAP: Record<PostCategory, string> = {
  all: '전체',
  event: '행사',
  activity: '활동',
  partnership: '제휴',
  release: '패치',
  others: '기타',
} as const;

export const CATEGORY_BADGE_LABEL_MAP: Record<CategoryBadge, string> = {
  event: POST_CATEGORY_LABEL_MAP.event,
  activity: POST_CATEGORY_LABEL_MAP.activity,
  partnership: POST_CATEGORY_LABEL_MAP.partnership,
  release: POST_CATEGORY_LABEL_MAP.release,
  others: POST_CATEGORY_LABEL_MAP.others,
} as const;

export const RESERVATION_LABEL = '예약중' as const;
