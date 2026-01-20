import { HeaderMode, HeaderProps } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import HeaderLogo from '../../../public/header-logo.svg';
import { PAGE_ROUTES } from './path';

type RouterInstance = ReturnType<typeof useRouter>;

export type RouteConfig = {
  id: string;
  path: string | RegExp;
  backPath: string;
  header: HeaderProps;
};

export const createRouteConfig = (router: RouterInstance): RouteConfig[] => [
  // {
  //   id: 'home',
  //   path: '/home',
  //   backPath: '/home',
  //   header: {
  //     mode: HeaderMode.Default,
  //     title: '홈',
  //     hasLeftIcon: true,
  //     icons: [
  //       { label: 'Search', onClickIcon: () => alert('검색') },
  //       { label: 'Share', onClickIcon: () => alert('공유') },
  //       { label: 'DotsVertical', onClickIcon: () => alert('메뉴') },
  //     ],
  //   },
  // },
  {
    id: 'mypage',
    path: PAGE_ROUTES.MYPAGE.MAIN,
    backPath: PAGE_ROUTES.HOME,
    header: {
      icons: [
        {
          label: 'Cog',
          onClickIcon: () => {
            router.push(PAGE_ROUTES.MYPAGE.SETTINGS);
          },
        },
      ],
      logo: <HeaderLogo role="presentation" aria-label="SURF 홈 로고" />,
      mode: HeaderMode.Logo,
    },
  },
  {
    id: 'mypage-activity-score',
    path: PAGE_ROUTES.MYPAGE.ACTIVITY_SCORE.MAIN,
    backPath: PAGE_ROUTES.MYPAGE.MAIN,
    header: {
      mode: HeaderMode.TextBtn,
      title: '활동점수',
      hasLeftIcon: true,
      text: '회칙',
      btnVariant: 'secondary',
      onClickTextBtn: () => {
        router.push(PAGE_ROUTES.MYPAGE.ACTIVITY_SCORE.BYLAWS);
      },
    },
  },
  {
    id: 'mypage-activity-score-bylaws',
    path: PAGE_ROUTES.MYPAGE.ACTIVITY_SCORE.BYLAWS,
    backPath: PAGE_ROUTES.MYPAGE.ACTIVITY_SCORE.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: 'TAVE 회칙',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-settings',
    path: PAGE_ROUTES.MYPAGE.SETTINGS,
    backPath: PAGE_ROUTES.MYPAGE.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: '설정 및 도움',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-scraps',
    path: PAGE_ROUTES.MYPAGE.SCRAPS,
    backPath: PAGE_ROUTES.MYPAGE.SETTINGS,
    header: {
      mode: HeaderMode.Default,
      title: '내가 스크랩한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-my-posts',
    path: PAGE_ROUTES.MYPAGE.MY_POSTS,
    backPath: PAGE_ROUTES.MYPAGE.SETTINGS,
    header: {
      mode: HeaderMode.Default,
      title: '내가 작성한 게시글',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-feedback',
    path: PAGE_ROUTES.MYPAGE.FEEDBACK,
    backPath: PAGE_ROUTES.MYPAGE.SETTINGS,
    header: {
      mode: HeaderMode.Default,
      title: '피드백 보내기',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy',
    path: PAGE_ROUTES.MYPAGE.POLICY.MAIN,
    backPath: PAGE_ROUTES.MYPAGE.SETTINGS,
    header: {
      mode: HeaderMode.Default,
      title: '이용약관',
      hasLeftIcon: true,
    },
  },

  // 약관 상세 페이지
  {
    id: 'mypage-policy-service-policy',
    path: PAGE_ROUTES.MYPAGE.POLICY.SERVICE,
    backPath: PAGE_ROUTES.MYPAGE.POLICY.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: 'SURF 서비스 이용약관',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-personal-info-policy',
    path: PAGE_ROUTES.MYPAGE.POLICY.PRIVACY,
    backPath: PAGE_ROUTES.MYPAGE.POLICY.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: '[필수] 개인정보 처리방침',
      hasLeftIcon: true,
    },
  },
  {
    id: 'mypage-policy-operating-info-policy',
    path: PAGE_ROUTES.MYPAGE.POLICY.OPERATING,
    backPath: PAGE_ROUTES.MYPAGE.POLICY.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: '[선택] 마케팅 정보 수신 동의',
      hasLeftIcon: true,
    },
  },

  {
    id: 'onboarding',
    path: PAGE_ROUTES.ONBOARDING,
    backPath: PAGE_ROUTES.LOGIN,
    header: {
      mode: HeaderMode.Default,
      hasLeftIcon: true,
    },
  },
  {
    id: 'profile',
    path: /^\/member\/\d+$/,
    backPath: PAGE_ROUTES.MEMBER.MEMBER_SEARCH,
    header: {
      mode: HeaderMode.Default,
      hasLeftIcon: true,
    },
  },
  // {
  //   id: 'board',
  //   path: PAGE_ROUTES.BOARD.MAIN,
  //   backPath: PAGE_ROUTES.HOME, // 임시
  //   header: {
  //     mode: HeaderMode.Default,
  //     title: '공지사항',
  //     hasLeftIcon: true,
  //     icons: [
  //       {
  //         label: 'Search',
  //         onClickIcon: () => {
  //           router.push(PAGE_ROUTES.BOARD.SEARCH);
  //         },
  //       },
  //     ],
  //   },
  // },
  {
    id: 'home-calendar',
    path: PAGE_ROUTES.CALENDAR.MAIN,
    backPath: PAGE_ROUTES.HOME,
    header: {
      mode: HeaderMode.Default,
      title: '일정',
      hasLeftIcon: true,
    },
  },
  {
    id: 'post-detail',
    // 게시글 목록이랑 합친 후 동적 세그먼트로 변경 예정
    path: PAGE_ROUTES.BOARD.POST_DETAIL('[boardId]', '[postId]'),
    backPath: PAGE_ROUTES.BOARD.MAIN,
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
  {
    id: 'mypage-password',
    path: PAGE_ROUTES.MYPAGE.PASSWORD,
    backPath: PAGE_ROUTES.MYPAGE.MAIN,
    header: {
      mode: HeaderMode.Default,
      title: '비밀번호 설정',
      hasLeftIcon: true,
    },
  },
];
