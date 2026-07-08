import { BOARD_CATEGORIES } from './category';

export const POST_BOARDS = [
  { id: 1, label: '공지사항', createPostAdminOnly: true },
  { id: 2, label: '게시판', createPostAdminOnly: false },
] as const satisfies readonly {
  id: keyof typeof BOARD_CATEGORIES;
  label: string;
  createPostAdminOnly: boolean;
}[];
