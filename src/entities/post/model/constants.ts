// 게시판
export const POST_BOARDS = [{ id: 1, label: '공지사항' }] as const;

// 게시글
export const POST_CATEGORIES = [
  { id: 1, label: '행사' },
  { id: 2, label: '활동' },
  { id: 3, label: '제휴' },
  { id: 4, label: '패치' },
  { id: 5, label: '기타' },
] as const;

// 탭
export const TAB_CATEGORIES = [{ id: 'all', label: '전체' }, ...POST_CATEGORIES] as const;

// 예약
export const RESERVATION_LABEL = '예약중';
