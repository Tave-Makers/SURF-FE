import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import KakaoCallBackPage from '@/app-pages/login/ui/KakaoCallBackPage';
import type { ValidStatusResponse } from '@/features/auth/api/types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = async () => {
  const res = await serverFetchWithCookies('/v1/user/members/valid-status', {
    authRedirect: false,
  });
  if (res.ok) {
    const raw: unknown = await res.json();
    const json = raw as ValidStatusResponse;
    const { memberStatus } = json.data;

    if (memberStatus === 'APPROVED') redirect(PAGE_ROUTES.HOME);
    if (memberStatus === 'WAITING') redirect(PAGE_ROUTES.REDIRECT.MSG_PENDING);
    if (memberStatus === 'REJECTED') redirect(PAGE_ROUTES.REDIRECT.MSG_REJECTED);
    if (memberStatus === 'REGISTERING') redirect(PAGE_ROUTES.REDIRECT.MSG_INCOMPLETE);
  }

  return (
    // fallback은 추후 로딩 중 화면으로 대체
    <Suspense fallback={<div>로딩중...</div>}>
      <KakaoCallBackPage />
    </Suspense>
  );
};

export default Page;
