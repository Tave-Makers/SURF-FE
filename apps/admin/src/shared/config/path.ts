const GROUP_ROOT = '/group-management';
const SCORE_ROOT = '/score-management';

export const PAGE_ROUTES = {
  HOME: '/',
  SIGNUP_REQUEST: '/signup-request',
  LOGIN: '/login',
  SETTING_ACTIVE_COHORT: '/active-cohort',
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
  SCORE_MNG: SCORE_ROOT,
  SCORE_MNG_ASSIGN: `${SCORE_ROOT}/assign`,
  SCORE_MNG_ASSIGN_TARGET: (criterionId: string | number) => `${SCORE_ROOT}/assign/${criterionId}`,
  SCORE_MNG_MEMBER: (memberId: string | number): string => `${SCORE_ROOT}/member/${memberId}`,
  WELCOME_MSG: '/welcome-message',
  BADGE_MNG: {
    LIST: '/badge-management',
    CREATE: '/badge-management/create',
    DETAIL: (id: string | number) => `/badge-management/${id}`,
    EDIT: (id: string | number) => `/badge-management/${id}/edit`,
    ASSIGN: (id: string | number) => `/badge-management/${id}/assign`,
  },
} as const;
