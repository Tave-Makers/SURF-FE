import { LoginPage } from '@/app-pages/login/ui/LoginPage';
import { Suspense } from 'react';
export default function Page() {
  return;
  <Suspense fallback={null}>
    <LoginPage />
  </Suspense>;
}
