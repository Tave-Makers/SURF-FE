export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ONBOARDING: '/onboarding',

  // 멤버 관련
  MEMBER: { PROFILE: (memberId: string | number) => `/member/${memberId}` },
  MEMBER_SEARCH: '/member/search',

  // 캘린더 관련
  CALENDAR: {
    MAIN: '/calendar',
    CREATE: '/calendar/schedule/create',
    SCHEDULE_DETAIL: (id: string | number) => `/calendar/schedule/${id}`,
    SCHEDULE_EDIT: (id: string | number) => `/calendar/schedule/${id}/edit`,
  },

  // 게시판 관련
  BOARD: {
    MAIN: '/board/1',
    SELECT_CATEGORY: (boardId: string | number) => `/board/${boardId}`,
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
    MODE: '/settings/mode',
    POLICY: {
      MAIN: '/settings/policy',
      SERVICE: '/policy/service',
      PRIVACY: '/policy/personal-info',
      OPERATING: '/policy/operating-info',
    },
  },

  // 기타
  REDIRECT: {
    MSG_PENDING: '/login?msg=pending',
    MSG_REJECTED: '/login?msg=rejected',
    MSG_INCOMPLETE: '/onboarding?msg=incomplete',
  },
  NOTIFICATION: '/notification',
} as const;
