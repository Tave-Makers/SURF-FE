'use client';

import { type ReactNode, useEffect, useState } from 'react';

const SHOULD_ENABLE_MSW =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';

let startWorkerPromise: Promise<void> | null = null;

async function enableMocking() {
  if (!startWorkerPromise) {
    startWorkerPromise = import('@/test/mocks/browser').then(async ({ worker }) => {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      // 개발 중 MSW 활성화 여부를 콘솔에서 빠르게 확인하기 위한 로그
      console.info('[MSW] Browser mocking enabled');
    });
  }

  await startWorkerPromise;
}

export const MockingProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(!SHOULD_ENABLE_MSW);

  useEffect(() => {
    if (!SHOULD_ENABLE_MSW) return;

    void enableMocking().then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return <>{children}</>;
};
