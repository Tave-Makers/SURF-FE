'use client';

import '@/shared/styles/globals.css';
import { ErrorPage } from '@/app-pages/error/ErrorPage';
import type { ErrorPageProps } from '@/app-pages/error/ErrorPage';

const GlobalError = ({ error, reset }: ErrorPageProps) => {
  return (
    <html lang="ko">
      <body className="flex min-h-dvh items-center justify-center bg-gray-200">
        <main className="bg-background-normal box-content flex h-full w-dvw sm:h-[min(100dvh,calc(100dvw*812/375))] sm:w-[min(100dvw,calc(100dvh*375/812))]">
          <ErrorPage error={error} reset={reset} />
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
