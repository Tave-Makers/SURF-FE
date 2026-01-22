import { redirect } from 'next/navigation';
import OnBoardingPage from '@/app-pages/onboarding/ui/OnBoardingPage';
import type { ValidStatusResponse } from '@/features/auth/api/types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = async () => {
  const res = await serverFetchWithCookies('/v1/user/members/valid-status', {
    authRedirect: false,
  });

  if (res.status === 401 || res.status === 403) {
    redirect(PAGE_ROUTES.LOGIN);
  }
  if (res.ok) {
    const raw: unknown = await res.json();
    const json = raw as ValidStatusResponse;
    const { memberStatus } = json.data;

    if (memberStatus === 'APPROVED') redirect(PAGE_ROUTES.HOME);
    if (memberStatus === 'WAITING') redirect(PAGE_ROUTES.REDIRECT.MSG_PENDING);
    if (memberStatus === 'REJECTED') redirect(PAGE_ROUTES.REDIRECT.MSG_REJECTED);
    // REGISTERING은 온보딩 접근 허용
  } else {
    redirect(PAGE_ROUTES.LOGIN);
  }

  return <OnBoardingPage />;
};

export default Page;
