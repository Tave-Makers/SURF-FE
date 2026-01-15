import { Suspense } from 'react';
import { LoginPage } from '@/app-pages/login/ui/LoginPage';

const Page = () => {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
};
export default Page;
