export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',
  PROFILE: '/profile',

  // 캘린더 관련
  CALENDAR: {
    MAIN: '/calendar',
    CREATE: '/calendar/schedule/create',
    detail: (id: string | number) => `/calendar/schedule/${id}`,
    edit: (id: string | number) => `/calendar/schedule/${id}/edit`,
  },

  // 게시판 관련
  BOARD: {
    MAIN: (boardId: string | number) => `/board/${boardId}`,
    SEARCH: '/board/search',
    POST_DETAIL: (boardId: string | number, postId: string | number) =>
      `/board/${boardId}/post/${postId}`,
    POST_CREATE: (boardId: string | number) => `/board/${boardId}/post/create`,
    POST_SCHEDULE: '/post/schedule', // PostEditorToolbar.tsx
  },

  // 마이페이지 & 설정
  MYPAGE: {
    MAIN: '/mypage',
    EDIT: '/mypage/edit',
    ACTIVITY_SCORE: {
      MAIN: '/mypage/activity-score',
      BYLAWS: '/mypage/activity-score/bylaws',
    },
    SETTINGS: '/settings',
    FEEDBACK: '/settings/feedback',
    SCRAPS: '/settings/scraps',
    MY_POSTS: '/settings/my-posts',
    POLICY: {
      MAIN: '/settings/policy',
      SERVICE: '/settings/policy/service',
      PRIVACY: '/settings/policy/personal-info',
      MARKETING: '/settings/policy/marketing-info',
    },
  },

  // 기타
  SIGNUP: '/signup',
  REDIRECT: {
    MSG_PENDING: '/login?msg=pending',
    MSG_REJECTED: '/login?msg=rejected',
    MSG_INCOMPLETE: '/onboarding?msg=incomplete',
  },
  NOTIFICATION: '/notification',
} as const;
