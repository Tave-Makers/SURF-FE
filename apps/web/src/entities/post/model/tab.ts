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

export type TabCategoryLabel = '전체' | PostCategoryLabel;

// boardId별 탭 목록 (BOARD_CATEGORIES 기반 자동 파생)
export const BOARD_TAB_MAP: Record<number, TabItem[]> = Object.fromEntries(
  Object.keys(BOARD_CATEGORIES).map((id) => [Number(id), toTabItems(Number(id))]),
);
