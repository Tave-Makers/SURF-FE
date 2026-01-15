import { PAGE_ROUTES } from '@/shared/config/path';
import NoticeIcon from '@/shared/assets/icons/home/notice.svg';
import CalendarIcon from '@/shared/assets/icons/home/calendar.svg';
import AddressBookIcon from '@/shared/assets/icons/home/address-book.svg';

export interface ShortcutItem {
  id: number;
  label: string;
  imageSrc?: React.FC<React.SVGProps<SVGSVGElement>>;
  link: string; // 클릭 시 이동할 주소
}

// 1. 앱 내 바로가기 데이터
export const SHORTCUT_LINKS: ShortcutItem[] = [
  { id: 1, label: '공지사항', imageSrc: NoticeIcon, link: PAGE_ROUTES.BOARD.MAIN },
  { id: 2, label: '일정', imageSrc: CalendarIcon, link: PAGE_ROUTES.CALENDAR.MAIN },
  { id: 3, label: '주소록', imageSrc: AddressBookIcon, link: PAGE_ROUTES.MEMBER.MEMBER_SEARCH },
];

// 2. TAVE 채널 데이터
// TODO: svg 이미지 추가 필요
export const TAVE_CHANNEL_LINKS: ShortcutItem[] = [
  {
    id: 1,
    label: '인스타그램',
    link: 'https://instagram.com/...',
  },
  { id: 2, label: '유튜브', link: 'https://youtube.com/...' },
  { id: 3, label: '미디엄', link: 'https://medium.com/...' },
  { id: 4, label: '공식 홈페이지', link: 'https://tave.or.kr' },
];

// 3. 후원사 데이터
// TODO: svg 이미지 추가 필요
export const SPONSOR_LINKS: ShortcutItem[] = [
  { id: 1, label: '후원사 A', link: 'https://...' },
  { id: 2, label: '후원사 B', link: 'https://...' },
  { id: 3, label: '후원사 C', link: 'https://...' },
  { id: 4, label: '후원사 D', link: 'https://...' },
  { id: 5, label: '후원사 E', link: 'https://...' },
  { id: 6, label: '후원사 F', link: 'https://...' },
  { id: 7, label: '후원사 G', link: 'https://...' },
  { id: 8, label: '후원사 H', link: 'https://...' },
];
