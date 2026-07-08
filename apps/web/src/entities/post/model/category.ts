type CategoryItem = { key: string; id: number; label: string };

export const BOARD_CATEGORIES = {
  1: [
    { key: 'event', id: 1, label: '행사' },
    { key: 'activity', id: 2, label: '활동' },
    { key: 'partnership', id: 3, label: '제휴' },
    { key: 'patch', id: 4, label: '패치' },
    { key: 'etc', id: 5, label: '기타' },
  ],
  2: [
    { key: 'recruit', id: 6, label: '팀원 모집' },
    { key: 'info', id: 7, label: '정보' },
    { key: 'qna', id: 8, label: '질문' },
    { key: 'etc', id: 9, label: '기타' },
  ],
} as const satisfies Record<number, readonly CategoryItem[]>;

const ALL_CATEGORIES = [...BOARD_CATEGORIES[1], ...BOARD_CATEGORIES[2]] as const;

export type PostCategoryKey = (typeof ALL_CATEGORIES)[number]['key'];
export type PostCategoryLabel = (typeof ALL_CATEGORIES)[number]['label'];

export const getCategoriesForBoard = (boardId: number): readonly CategoryItem[] =>
  (BOARD_CATEGORIES as Record<number, readonly CategoryItem[]>)[boardId] ?? BOARD_CATEGORIES[1];

export const categoryIdToLabel = (id: number | null | undefined): PostCategoryLabel =>
  ALL_CATEGORIES.find((c) => c.id === id)?.label ?? '기타';

export const categoryIdToKey = (id?: number | null): string | undefined =>
  ALL_CATEGORIES.find((c) => c.id === id)?.key;

export const categoryKeyToId = (key: string, boardId: number): number | undefined =>
  getCategoriesForBoard(boardId).find((c) => c.key === key)?.id;

export const categoryKeyToId = (key: string, _boardId?: number): number | undefined =>
  Object.values(POST_CATEGORIES).find((c) => c.key === key)?.id;

export const getCategoriesForBoard = (_boardId?: number) => Object.values(POST_CATEGORIES);

export const categoryKeyToId = (key: string, _boardId?: number): number | undefined =>
  Object.values(POST_CATEGORIES).find((c) => c.key === key)?.id;

export const getCategoriesForBoard = (_boardId?: number) => Object.values(POST_CATEGORIES);

export const isPostCategoryKey = (value: unknown): value is PostCategoryKey =>
  ALL_CATEGORIES.some((c) => c.key === String(value));
