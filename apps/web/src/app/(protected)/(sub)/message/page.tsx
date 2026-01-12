import { Suspense } from 'react';
import { SendMessagePage } from '@/app-pages/message/ui/SendMessagePage';

const Page = () => {
  return (
    <Suspense fallback={null}>
      <SendMessagePage />
    </Suspense>
  );
};

export default Page;
