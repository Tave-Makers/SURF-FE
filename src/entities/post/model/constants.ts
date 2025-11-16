// 게시글
export type PostCategoryLabel = '행사' | '활동' | '제휴' | '패치' | '기타';

export const POST_CATEGORIES = [
  { id: 1, label: '행사' },
  { id: 2, label: '활동' },
  { id: 3, label: '제휴' },
  { id: 4, label: '패치' },
  { id: 5, label: '기타' },
] as const;

export type PostCategoryId = (typeof POST_CATEGORIES)[number]['id'];

// 탭
export type TabCategoryLabel = '전체' | PostCategoryLabel;

export const TAB_CATEGORIES = [{ id: 'all', label: '전체' }, ...POST_CATEGORIES] as const;

export type TabCategoryId = (typeof TAB_CATEGORIES)[number]['id'];

// 예약
export const RESERVATION_LABEL = '예약중';
