import { PAGE_ROUTES } from '@/shared/config/path';

export const NAV_ITEMS = [
  {
    id: 'signup-request',
    label: '회원가입 승인',
    path: PAGE_ROUTES.SIGNUP_REQUEST,
  },
  {
    id: 'setting-active-generation',
    label: '활동기수 설정',
    path: PAGE_ROUTES.SETTING_ACTIVE_GENERATION,
  },
  {
    id: 'member',
    label: '전체멤버 관리',
    path: PAGE_ROUTES.MEMBER_MNG,
  },
  {
    id: 'banner',
    label: '홈배너 관리',
    path: PAGE_ROUTES.BANNER.LIST,
  },
  {
    id: 'dashboard',
    label: 'SURF 대시보드',
    path: PAGE_ROUTES.DASHBOARD,
  },
  {
    id: 'group',
    label: '회원그룹 관리',
    path: PAGE_ROUTES.GROUP_MNG.LIST,
  },
  {
    id: 'score',
    label: '활동점수 관리',
    path: PAGE_ROUTES.SCORE_MNG,
  },
  {
    id: 'badge',
    label: '활동배지 관리',
    path: PAGE_ROUTES.BADGE_MNG,
  },
  {
    id: 'welcome-msg',
    label: '웰컴 메세지 관리',
    path: PAGE_ROUTES.WELCOME_MSG,
  },
] as const;

export type TabId = (typeof NAV_ITEMS)[number]['id'];
