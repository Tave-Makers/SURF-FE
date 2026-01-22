import { PAGE_ROUTES } from '@/shared/config/path';

export interface ShortcutItem {
  id: number;
  label: string;
  imageSrc?: string;
  link: string;
}

// 앱 내 바로가기
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

// 테이브 채널
export const TAVE_CHANNEL_LINKS: ShortcutItem[] = [
  {
    id: 1,
    label: 'Homepage',
    link: 'https://www.tave-wave.com/',
    imageSrc: '/images/tave-channel/homepage.svg',
  },
  {
    id: 2,
    label: 'Agit',
    link: 'https://tave.agit.io/home/',
    imageSrc: '/images/tave-channel/agit.webp',
  },
  {
    id: 3,
    label: 'Instagram',
    link: 'https://www.instagram.com/tave_wave/',
    imageSrc: '/images/tave-channel/instagram.webp',
  },
  {
    id: 4,
    label: 'Blog',
    link: 'https://blog.naver.com/t-ave/',
    imageSrc: '/images/tave-channel/blog.webp',
  },
];

// 후원사
export const SPONSOR_LINKS: ShortcutItem[] = [
  { id: 1, label: 'F-Lab', link: 'https://f-lab.kr/', imageSrc: '/images/sponsor/f-lab.jpg' },
  {
    id: 2,
    label: '렛츠커리어',
    link: 'https://www.letscareer.co.kr/',
    imageSrc: '/images/sponsor/letscareer.webp',
  },
  {
    id: 3,
    label: '알파코',
    link: 'https://corp.alpaco.co.kr/',
    imageSrc: '/images/sponsor/alpaco.png',
  },
  {
    id: 4,
    label: 'Upstage',
    link: 'https://www.upstage.ai/',
    imageSrc: '/images/sponsor/upstage.png',
  },
  {
    id: 5,
    label: '코드잇',
    link: 'https://www.codeit.kr/promotions/year-end/',
    imageSrc: '/images/sponsor/codeit.png',
  },
];
