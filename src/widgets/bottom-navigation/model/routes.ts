export const BOTTOM_NAV_ITEMS = [
  {
    id: 'home',
    label: '홈',
    path: '/home',
    activeIcon: 'HomeSolid',
    defaultIcon: 'Home',
    relatedRoots: ['/home'],
  },
  {
    id: 'mypage',
    label: '마이페이지',
    path: '/mypage',
    activeIcon: 'SmileCircleSolid',
    defaultIcon: 'SmileCircle',
    relatedRoots: ['/mypage'],
  },
] as const;

export type TabId = (typeof BOTTOM_NAV_ITEMS)[number]['id'];
