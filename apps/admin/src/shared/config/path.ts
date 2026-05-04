const GROUP_ROOT = '/group-management';

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
  GROUP_MNG: {
    LIST: GROUP_ROOT,
    CREATE: `${GROUP_ROOT}/create`,
    VIEW: (id: string | number) => `${GROUP_ROOT}/${id}`,
    EDIT: (id: string | number) => `${GROUP_ROOT}/${id}?mode=edit`,
    MEMBER_SEARCH: `${GROUP_ROOT}/member-search`,
  },
  SCORE_MNG: '/score-management',
  BADGE_MNG: '/badge-management',
  WELCOME_MSG: '/welcome-message',
} as const;
