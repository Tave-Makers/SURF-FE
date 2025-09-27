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
    id: 'mypage-settings',
    path: '/mypage/settings',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '설정 및 도움',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-scraps',
    path: '/mypage/scraps',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '내가 스크랩한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-my-posts',
    path: '/mypage/my-posts',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '내가 작성한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-faq',
    path: '/mypage/faq',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: 'FAQ',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-feedback',
    path: '/mypage/feedback',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '피드백 보내기',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy',
    path: '/mypage/policy',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },

  // 약관 상세 페이지
  {
    id: 'mypage-policy-service-policy',
    path: '/mypage/policy/service-policy',
    backPath: '/mypage/policy',
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-personal-info-policy',
    path: '/mypage/policy/personal-info-policy',
    backPath: '/mypage/policy',
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-marketing-info-policy',
    path: '/mypage/policy/marketing-info-policy',
    backPath: '/mypage/policy',
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },

  // onboarding 관련
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
