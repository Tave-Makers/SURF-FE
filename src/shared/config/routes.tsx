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
    // TODO: text 속성에 대한 커스텀 스타일 필요
    id: 'activity-score',
    path: '/mypage/activity-score',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.TextBtn,
      title: '활동점수',
      hasLeftIcon: true,
      text: '회칙',
      btnVariant: 'secondary',
      onClickTextBtn: () => alert('회칙 페이지로 이동'),
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
