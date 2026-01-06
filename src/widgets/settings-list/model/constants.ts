import { SettingsItemType } from './types';

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
    action: { type: 'NAVIGATE', payload: '/settings/scraps' },
  },
  {
    id: 'my-posts',
    leftIconName: 'Edit',
    text: '내가 작성한 게시글',
    action: { type: 'NAVIGATE', payload: '/settings/my-posts' },
  },
  {
    id: 'feedback',
    leftIconName: 'ChatDots',
    text: '피드백 보내기',
    action: { type: 'NAVIGATE', payload: '/settings/feedback' },
  },
  {
    id: 'mode',
    leftIconName: 'CircleHalfSolid',
    text: '테마 변경',
    action: { type: 'NAVIGATE', payload: '/settings/mode' },
  },
  {
    id: 'policy',
    leftIconName: 'InfoCircle',
    text: '이용약관',
    action: { type: 'NAVIGATE', payload: '/settings/policy' },
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
