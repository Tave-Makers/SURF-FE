import { BOARD_CATEGORIES, getCategoriesForBoard } from './category';
import type { PostCategoryLabel } from './category';

export type TabItem = { value: string; label: TabCategoryLabel };

const toTabItems = (boardId: number): TabItem[] => [
  { value: 'all', label: '전체' },
  ...getCategoriesForBoard(boardId).map((c) => ({
    value: c.key,
    label: c.label as TabCategoryLabel,
  })),
];

// board 1 전용 탭 (검색 페이지에서 사용)
export const TAB_CATEGORIES = {
  all: { key: 'all', label: '전체' },
  ...Object.fromEntries(BOARD_CATEGORIES[1].map((c) => [c.key, { key: c.key, label: c.label }])),
} as const;

export type TabCategoryKey = keyof typeof TAB_CATEGORIES;
export type TabCategoryLabel = '전체' | PostCategoryLabel;

export const TAB_CATEGORY_LIST = toTabItems(1);

// boardId별 탭 목록 (BOARD_CATEGORIES 기반 자동 파생)
export const BOARD_TAB_MAP: Record<number, TabItem[]> = Object.fromEntries(
  Object.keys(BOARD_CATEGORIES).map((id) => [Number(id), toTabItems(Number(id))]),
);
