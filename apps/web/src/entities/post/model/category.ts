export const POST_CATEGORIES = {
  event: { key: 'event', id: 1, label: '행사' },
  activity: { key: 'activity', id: 2, label: '활동' },
  partnership: { key: 'partnership', id: 3, label: '제휴' },
  patch: { key: 'patch', id: 4, label: '패치' },
  etc: { key: 'etc', id: 5, label: '기타' },
} as const;

export type PostCategoryKey = keyof typeof POST_CATEGORIES;
export type PostCategoryLabel = (typeof POST_CATEGORIES)[PostCategoryKey]['label'];

export const categoryIdToLabel = (id: number | null | undefined) => {
  const found = Object.values(POST_CATEGORIES).find((c) => c.id === id);
  return found?.label ?? '기타';
};

export const categoryIdToKey = (id?: number | null) => {
  if (!id) return undefined;
  return Object.values(POST_CATEGORIES).find((c) => c.id === id)?.key;
};

export const isPostCategoryKey = (value: unknown): value is PostCategoryKey =>
  Object.keys(POST_CATEGORIES).includes(String(value));
