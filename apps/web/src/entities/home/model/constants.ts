import { PAGE_ROUTES } from '@/shared/config/path';

export interface ShortcutItem {
  id: number;
  label: string;
  imageSrc?: string;
  link: string; // 클릭 시 이동할 주소
}

// 1. 앱 내 바로가기 데이터
export const SHORTCUT_LINKS: ShortcutItem[] = [
  { id: 1, label: '공지사항', imageSrc: '/images/home/notice.svg', link: PAGE_ROUTES.BOARD.MAIN },
  { id: 2, label: '일정', imageSrc: '/images/home/calendar.svg', link: PAGE_ROUTES.CALENDAR.MAIN },
  {
    id: 3,
    label: '주소록',
    imageSrc: '/images/home/address-book.svg',
    link: PAGE_ROUTES.MEMBER.MEMBER_SEARCH,
  },
];

// 2. TAVE 채널 데이터
// TODO: svg 이미지 추가 필요
export const TAVE_CHANNEL_LINKS: ShortcutItem[] = [
  {
    id: 1,
    label: '공식 홈페이지',
    link: 'https://instagram.com/...',
  },
  { id: 2, label: '인스타그램', link: 'https://youtube.com/...' },
  { id: 3, label: '미디엄', link: 'https://medium.com/...' },
  { id: 4, label: '공식 홈페이지', link: 'https://tave.or.kr' },
];

// 3. 후원사 데이터
export const SPONSOR_LINKS: ShortcutItem[] = [
  { id: 1, label: 'F-Lab', link: 'https://f-lab.kr/', imageSrc: '/images/tave-channel/agit.webp' },
  { id: 2, label: '렛츠커리어', link: 'https://www.letscareer.co.kr/' },
  { id: 3, label: '알파코', link: 'https://corp.alpaco.co.kr/' },
  { id: 4, label: 'Upstage', link: 'https://www.upstage.ai/' },
  { id: 5, label: '코드잇', link: 'https://www.codeit.kr/promotions/year-end/' },
];
