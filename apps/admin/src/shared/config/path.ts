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
  WELCOME_MSG: '/welcome-message',
  BADGE_MNG: {
    LIST: '/badge-management',
    CREATE: '/badge-management/create',
    DETAIL: (id: string | number) => `/badge-management/${id}`,
    EDIT: (id: string | number) => `/badge-management/${id}/edit`,
    ASSIGN: (id: string | number) => `/badge-management/${id}/assign`,
  },
} as const;
