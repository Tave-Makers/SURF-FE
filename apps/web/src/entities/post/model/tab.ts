import { POST_CATEGORIES } from './category';
import type { PostCategoryLabel } from './category';

// 공지사항 탭 카테고리
export const TAB_CATEGORIES = {
  all: {
    key: 'all',
    label: '전체',
  },
  ...Object.fromEntries(
    Object.values(POST_CATEGORIES).map((c) => [c.key, { key: c.key, label: c.label }]),
  ),
} as const;

export type TabCategoryKey = keyof typeof TAB_CATEGORIES;
export type TabCategoryLabel = '전체' | PostCategoryLabel;

export const TAB_CATEGORY_LIST = Object.values(TAB_CATEGORIES).map((c) => ({
  value: c.key,
  label: c.label,
}));
