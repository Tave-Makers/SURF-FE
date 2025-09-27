import { SettingsItemType } from './types';

export const SETTINGS_ITEMS: SettingsItemType[] = [
  {
    id: 'scraps',
    leftIconName: 'Bookmark',
    text: '내가 스크랩한 게시글',
    action: { type: 'NAVIGATE', payload: '/mypage/scraps' },
  },
  {
    id: 'my-posts',
    leftIconName: 'Edit',
    text: '내가 작성한 게시글',
    action: { type: 'NAVIGATE', payload: '/mypage/my-posts' },
  },
  {
    id: 'faq',
    leftIconName: 'File',
    text: 'FAQ',
    action: { type: 'NAVIGATE', payload: '/mypage/faq' },
  },
  {
    id: 'feedback',
    leftIconName: 'ChatDots',
    text: '피드백 보내기',
    action: { type: 'NAVIGATE', payload: '/mypage/feedback' },
  },
  {
    id: 'policy',
    leftIconName: 'InfoCircle',
    text: '이용약관',
    action: { type: 'NAVIGATE', payload: '/mypage/policy' },
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
