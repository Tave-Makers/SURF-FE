import { PAGE_ROUTES } from '@/shared/config/path';

export interface ShortcutItem {
  id: number;
  label: string;
  imageSrc: string;
  link: string; // 클릭 시 이동할 주소
}

// 1. 앱 내 바로가기 데이터
export const SHORTCUT_LINKS: ShortcutItem[] = [
  { id: 1, label: '공지사항', imageSrc: '/icons/notice.png', link: PAGE_ROUTES.BOARD.MAIN(1) },
  { id: 2, label: '일정', imageSrc: '/icons/notice.png', link: PAGE_ROUTES.CALENDAR.MAIN },
  { id: 3, label: '주소록', imageSrc: '/icons/job.png', link: '/job' },
];

// 2. TAVE 채널 데이터
export const TAVE_CHANNEL_LINKS: ShortcutItem[] = [
  {
    id: 1,
    label: '인스타그램',
    imageSrc: '/icons/instagram.png',
    link: 'https://instagram.com/...',
  },
  { id: 2, label: '유튜브', imageSrc: '/icons/youtube.png', link: 'https://youtube.com/...' },
  { id: 3, label: '미디엄', imageSrc: '/icons/medium.png', link: 'https://medium.com/...' },
  { id: 4, label: '공식 홈페이지', imageSrc: '/icons/homepage.png', link: 'https://tave.or.kr' },
];

// 3. 후원사 데이터
export const SPONSOR_LINKS: ShortcutItem[] = [
  { id: 1, label: '후원사 A', imageSrc: '/sponsors/sponsor-a.png', link: 'https://...' },
  { id: 2, label: '후원사 B', imageSrc: '/sponsors/sponsor-b.png', link: 'https://...' },
  { id: 3, label: '후원사 C', imageSrc: '/sponsors/sponsor-c.png', link: 'https://...' },
  { id: 4, label: '후원사 D', imageSrc: '/sponsors/sponsor-d.png', link: 'https://...' },
  { id: 5, label: '후원사 E', imageSrc: '/sponsors/sponsor-e.png', link: 'https://...' },
  { id: 6, label: '후원사 F', imageSrc: '/sponsors/sponsor-f.png', link: 'https://...' },
  { id: 7, label: '후원사 G', imageSrc: '/sponsors/sponsor-g.png', link: 'https://...' },
  { id: 8, label: '후원사 H', imageSrc: '/sponsors/sponsor-h.png', link: 'https://...' },
];
