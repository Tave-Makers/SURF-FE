import type { IconName } from '@surf/ui/icon';

export const BOTTOM_NAV_ITEMS = [
  {
    id: 'home',
    label: '홈',
    path: '/',
    relatedRoots: ['/', '/home'],
    icons: { active: 'HomeSolid', default: 'Home' } satisfies {
      active: IconName;
      default: IconName;
    },
  },
  {
    id: 'mypage',
    label: '마이페이지',
    path: '/mypage',
    relatedRoots: ['/mypage'],
    icons: {
      active: 'SmileCircleSolid',
      default: 'SmileCircle',
    } satisfies { active: IconName; default: IconName },
  },
] as const;

export type TabId = (typeof BOTTOM_NAV_ITEMS)[number]['id'];
