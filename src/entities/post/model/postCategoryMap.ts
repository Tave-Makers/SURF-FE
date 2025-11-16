import type { PostCategory, CategoryBadge } from './types';

export const POST_CATEGORY_LABEL_MAP: Record<PostCategory, string> = {
  all: '전체',
  event: '행사',
  activity: '활동',
  partnership: '제휴',
  patch: '패치',
  etc: '기타',
};

export const CATEGORY_BADGE_LABEL_MAP: Record<CategoryBadge, string> = {
  event: '행사',
  activity: '활동',
  partnership: '제휴',
  patch: '패치',
  etc: '기타',
};

export const RESERVATION_LABEL = '예약중';
