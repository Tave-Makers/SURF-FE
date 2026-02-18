export const PAGE_ROUTES = {
  HOME: '/',
  SIGNUP_REQUEST: '/signup-request',
  LOGIN: '/login',
  SETTING_ACTIVE_GENERATION: '/active-generation',
  MEMBER_MNG: '/member-management',
  BANNER: {
    CREATE: '/banner/create',
    EDIT: (id: string | number) => `/banner/edit/${id}`,
    LIST: '/banner',
  },
  DASHBOARD: '/dashboard',
  GROUP_MNG: '/group-management',
  SCORE_MNG: '/score-management',
  BADGE_MNG: '/badge-management',
} as const;
