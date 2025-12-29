import { HeaderMode, HeaderProps } from '@/shared/ui/header/Header';
import { DummyLogo } from '@/shared/ui/logo/DummyLogo';
import { useRouter } from 'next/navigation';

type RouterInstance = ReturnType<typeof useRouter>;

export type RouteConfig = {
  id: string;
  path: string;
  backPath: string;
  header: HeaderProps;
};

export const createRouteConfig = (router: RouterInstance): RouteConfig[] => [
  {
    id: 'home',
    path: '/',
    backPath: '/',
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
    id: 'mypage',
    path: '/mypage',
    backPath: '/',
    header: {
      icons: [
        {
          label: 'Cog',
          onClickIcon: () => {
            router.push('/settings');
          },
        },
      ],
      logo: <DummyLogo />,
      mode: HeaderMode.Logo,
    },
  },
  {
    id: 'mypage-activity-score',
    path: '/mypage/activity-score',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.TextBtn,
      title: '활동점수',
      hasLeftIcon: true,
      text: '회칙',
      btnVariant: 'secondary',
      onClickTextBtn: () => {
        router.push('/mypage/activity-score/bylaws');
      },
    },
  },
  {
    id: 'mypage-activity-score-bylaws',
    path: '/mypage/activity-score/bylaws',
    backPath: '/mypage/activity-score',
    header: {
      mode: HeaderMode.Default,
      title: 'TAVE 회칙',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-settings',
    path: '/settings',
    backPath: '/mypage',
    header: {
      mode: HeaderMode.Default,
      title: '설정 및 도움',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-scraps',
    path: '/settings/scraps',
    backPath: '/settings',
    header: {
      mode: HeaderMode.Default,
      title: '내가 스크랩한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-my-posts',
    path: '/settings/my-posts',
    backPath: '/settings',
    header: {
      mode: HeaderMode.Default,
      title: '내가 작성한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-feedback',
    path: '/settings/feedback',
    backPath: '/settings',
    header: {
      mode: HeaderMode.Default,
      title: '피드백 보내기',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy',
    path: '/settings/policy',
    backPath: '/settings',
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },

  // 약관 상세 페이지
  {
    id: 'mypage-policy-service-policy',
    path: '/settings/policy/service',
    backPath: '/settings/policy',
    header: {
      mode: HeaderMode.Default,
      title: 'SURF 서비스 이용약관',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-personal-info-policy',
    path: '/settings/policy/personal-info',
    backPath: '/settings/policy',
    header: {
      mode: HeaderMode.Default,
      title: '개인정보 수집·이용 동의서',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-marketing-info-policy',
    path: '/settings/policy/marketing-info',
    backPath: '/settings/policy',
    header: {
      mode: HeaderMode.Default,
      title: '[선택] 마케팅 정보 수신 동의',
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
  {
    id: 'profile',
    path: '/profile',
    backPath: '/mypage', // 임시
    header: {
      mode: HeaderMode.Default,
      hasLeftIcon: true,
    },
  },
  {
    id: 'board',
    path: '/board',
    backPath: '/', // 임시
    header: {
      mode: HeaderMode.Default,
      title: '공지사항',
      hasLeftIcon: true,
      icons: [
        {
          label: 'Search',
          onClickIcon: () => {
            router.push('/board/search');
          },
        },
      ],
    },
  },
  {
    id: 'board-search',
    path: '/board/search',
    backPath: '/board',
    header: {
      mode: HeaderMode.SearchBar,
      hasLeftIcon: true,
      value: '',
      onChange: () => {},
      onSubmit: () => {},
    },
  },
  {
    id: 'home-calendar',
    path: '/home/calendar',
    backPath: '/',
    header: {
      mode: HeaderMode.Default,
      title: '일정',
      hasLeftIcon: true,
    },
  },
  {
    id: 'post-detail',
    // 게시글 목록이랑 합친 후 동적 세그먼트로 변경 예정
    path: '/board/[boardId]/post/[postId]',
    backPath: '/board/[boardId]',
    header: {
      mode: HeaderMode.Default,
      title: '공지사항',
      hasLeftIcon: true,
      icons: [
        { label: 'FatCornerUpRight', onClickIcon: () => alert('공유') },
        { label: 'Dots', onClickIcon: () => alert('메뉴') },
      ],
    },
  },
];
