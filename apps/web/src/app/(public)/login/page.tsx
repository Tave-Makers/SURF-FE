import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoginPage } from '@/app-pages/login/ui/LoginPage';
import type { ValidStatusResponse } from '@/features/auth/api/types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) => {
  const params = await searchParams;
  const msgParam = params?.msg;
  const msg = Array.isArray(msgParam) ? msgParam[0] : msgParam;

  const res = await serverFetchWithCookies('/v1/user/members/valid-status', {
    authRedirect: false,
  });
  if (res.ok) {
    const raw: unknown = await res.json();
    const json = raw as ValidStatusResponse;
    const { memberStatus } = json.data;

    if (memberStatus === 'APPROVED') redirect(PAGE_ROUTES.HOME);
    if (memberStatus === 'WAITING' && msg !== 'pending') {
      redirect(PAGE_ROUTES.REDIRECT.MSG_PENDING);
    }
    if (memberStatus === 'REJECTED' && msg !== 'rejected') {
      redirect(PAGE_ROUTES.REDIRECT.MSG_REJECTED);
    }
    if (memberStatus === 'REGISTERING' && msg !== 'incomplete') {
      redirect(PAGE_ROUTES.REDIRECT.MSG_INCOMPLETE);
    }
  }

  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
};
export default Page;
