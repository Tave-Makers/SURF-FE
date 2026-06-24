import { Suspense } from 'react';

import OAuthCallbackPage from '@/app-pages/login/ui/OAuthCallbackPage';

const Page = () => (
  <Suspense>
    <OAuthCallbackPage />
  </Suspense>
);

export default Page;
