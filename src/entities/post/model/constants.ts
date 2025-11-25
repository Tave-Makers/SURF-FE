// 게시판
export const POST_BOARDS = [{ id: 1, label: '공지사항' }] as const;

// 게시글
export const POST_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'event', label: '행사' },
  { id: 'activity', label: '활동' },
  { id: 'partnership', label: '제휴' },
  { id: 'patch', label: '패치' },
  { id: 'etc', label: '기타' },
] as const;

// 탭
export const TAB_CATEGORIES = [{ id: 'all', label: '전체' }, ...POST_CATEGORIES] as const;

// 예약
export const RESERVATION_LABEL = '예약중';
