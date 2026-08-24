import { SettingsItemType } from './types';
import { PAGE_ROUTES } from '@/shared/config/path';

export const THEME_OPTIONS = [
  { value: 'system', label: '시스템 설정 모드', icon: 'Cog' },
  { value: 'light', label: '라이트 모드', icon: 'SunSolid' },
  { value: 'dark', label: '다크 모드', icon: 'MoonSolid' },
] as const;

export const SETTINGS_ITEMS: SettingsItemType[] = [
  {
    id: 'scraps',
    leftIconName: 'Bookmark',
    text: '내가 스크랩한 게시글',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.SCRAPS },
  },
  {
    id: 'my-posts',
    leftIconName: 'Edit',
    text: '내가 작성한 게시글',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.MY_POSTS },
  },
  {
    id: 'feedback',
    leftIconName: 'Envelope',
    text: '문의 · 피드백 보내기',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.FEEDBACK },
  },
  {
    id: 'mode',
    leftIconName: 'CircleHalfSolid',
    text: '테마 변경',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.MODE },
  },
  {
    id: 'blocked-members',
    leftIconName: 'SmileCircle',
    text: '차단한 회원 리스트',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.BLOCKED_MEMBERS },
  },
  {
    id: 'policy',
    leftIconName: 'InfoCircle',
    text: '이용약관',
    action: { type: 'NAVIGATE', payload: PAGE_ROUTES.MYPAGE.POLICY.MAIN },
  },
  {
    id: 'logout',
    leftIconName: 'Logout',
    text: '로그아웃',
    action: { type: 'OPEN_ALERT', payload: 'logout' },
  },
  {
    id: 'withdraw',
    leftIconName: 'XCircle',
    text: '회원탈퇴',
    action: { type: 'OPEN_ALERT', payload: 'withdraw' },
  },
];
