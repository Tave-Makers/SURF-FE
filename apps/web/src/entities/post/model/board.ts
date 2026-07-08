import { BOARD_CATEGORIES } from './category';

export const POST_BOARDS = [
  { id: 1, label: '공지사항', adminOnly: true },
  { id: 2, label: '게시판', adminOnly: false },
] as const satisfies readonly {
  id: keyof typeof BOARD_CATEGORIES;
  label: string;
  adminOnly: boolean;
}[];
