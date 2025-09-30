import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { DummyLogo } from '@/shared/ui/logo/DummyLogo';

export type RouteConfig = {
  id: string;
  path: string;
  backPath: string;
  header: HeaderProps;
};

export const ROUTE_CONFIG: RouteConfig[] = [
  {
    id: 'home',
    path: '/home',
    backPath: '/home',
    header: {
      mode: HeaderMode.Default,
      title: '홈',
      hasLeftIcon: true,
      icons: [
        { label: 'Search', onClickIcon: () => alert('검색') },
        { label: 'Share', onClickIcon: () => alert('공유') },
        { label: 'DotsVertical', onClickIcon: () => alert('메뉴') },
      ],
    },
  },
  {
    id: 'chat',
    path: '/chat',
    backPath: '/home',
    header: {
      mode: HeaderMode.Default,
      title: '채팅',
      hasLeftIcon: true,
      icons: [
        { label: 'Search', onClickIcon: () => alert('검색') },
        { label: 'Share', onClickIcon: () => alert('공유') },
        { label: 'DotsVertical', onClickIcon: () => alert('메뉴') },
      ],
    },
  },
  {
    id: 'mypage',
    path: '/mypage',
    backPath: '/home',
    header: {
      mode: HeaderMode.Logo,
      logo: <DummyLogo />,
      icons: [{ label: 'Search', onClickIcon: () => alert('설정') }],
    },
  },
  {
    id: 'mypage-activity-score-bylaws',
    path: '/mypage/activity-score/bylaws',
    header: {
      mode: HeaderMode.Default,
      title: 'TAVE 회칙',
      hasLeftIcon: true,
    },
  },
  {
    id: 'onboarding',
    path: '/onboarding',
    backPath: '/login',
    header: {
      mode: HeaderMode.Default,
      hasLeftIcon: true,
    },
  },
];
