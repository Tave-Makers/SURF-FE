import { HeaderMode, HeaderProps } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from './path';

type RouterInstance = ReturnType<typeof useRouter>;

export type RouteConfig = {
  id: string;
  path: string;
  backPath: string;
  header: HeaderProps;
};

export const createRouteConfig = (_router: RouterInstance): RouteConfig[] => [
  {
    id: 'signup-request',
    path: PAGE_ROUTES.SIGNUP_REQUEST,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '회원가입 요청',
      hasLeftIcon: true,
    },
  },
  {
    id: 'setting-active-cohort',
    path: PAGE_ROUTES.SETTING_ACTIVE_COHORT,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '활동기수 설정',
      hasLeftIcon: true,
    },
  },
  {
    id: 'member',
    path: PAGE_ROUTES.MEMBER_MNG,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '전체멤버 관리',
      hasLeftIcon: true,
    },
  },
  {
    id: 'dashboard',
    path: PAGE_ROUTES.DASHBOARD,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: 'SURF 대시보드',
      hasLeftIcon: true,
    },
  },
  {
    id: 'group',
    path: PAGE_ROUTES.GROUP_MNG.LIST,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '회원그룹 관리',
      hasLeftIcon: true,
    },
  },
  {
    id: 'score',
    path: PAGE_ROUTES.SCORE_MNG,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '활동점수 관리',
      hasLeftIcon: true,
    },
  },
  {
    id: 'badge-list',
    path: PAGE_ROUTES.BADGE_MNG.LIST,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '활동 뱃지 관리',
      hasLeftIcon: true,
    },
  },
  {
    id: 'badge-create',
    path: PAGE_ROUTES.BADGE_MNG.CREATE,
    backPath: PAGE_ROUTES.BADGE_MNG.LIST,
    header: {
      mode: HeaderMode.Default,
      title: '신규 뱃지 생성',
      hasLeftIcon: true,
    },
  },
  {
    id: 'create-banner',
    path: PAGE_ROUTES.BANNER.CREATE,
    backPath: PAGE_ROUTES.BANNER.LIST,
    header: {
      mode: HeaderMode.Default,
      title: '신규 배너 생성',
      hasLeftIcon: true,
    },
  },
];
