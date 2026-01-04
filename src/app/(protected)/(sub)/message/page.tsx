import { SendMessagePage } from '@/app-pages/message/ui/SendMessagePage';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SendMessagePage />
    </Suspense>
  );
}
