import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LoginPage } from '@/app-pages/login/ui/LoginPage';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = async () => {
  const cookieStore = await cookies();
  if (cookieStore.has('accessToken')) {
    redirect(PAGE_ROUTES.HOME);
  }

  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
};
export default Page;
