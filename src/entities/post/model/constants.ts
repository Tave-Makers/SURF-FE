export const POST_CATEGORIES = [
  { id: 1, label: '행사' },
  { id: 2, label: '활동' },
  { id: 3, label: '제휴' },
  { id: 4, label: '패치' },
  { id: 5, label: '기타' },
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
export type PostCategoryLabel = (typeof POST_CATEGORIES)[number]['label'];
