import { Suspense } from 'react';

import AppleCallbackPage from '@/app-pages/login/ui/AppleCallbackPage';

const Page = () => (
  <Suspense>
    <AppleCallbackPage />
  </Suspense>
);

export default Page;
