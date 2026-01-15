import { PAGE_ROUTES } from '@/shared/config/path';

export const LAW_LIST = [
  {
    id: 'laws1',
    title: '[필수] 서비스 이용약관',
    required: true,
    route: PAGE_ROUTES.MYPAGE.POLICY.SERVICE,
  },
  {
    id: 'laws2',
    title: '[필수] 개인정보 처리방침',
    required: true,
    route: PAGE_ROUTES.MYPAGE.POLICY.PRIVACY,
  },
  {
    id: 'laws3',
    title: '[필수] SURF 서비스 운영정책',
    required: true,
    route: PAGE_ROUTES.MYPAGE.POLICY.OPERATING,
  },
] as const;
