import type { ReactNode } from 'react';
import '@/shared/styles/globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import 'keen-slider/keen-slider.min.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          href="https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-100">
        <QueryProvider>
          <AuthProvider>
            <main className="bg-background-normal box-content flex h-full w-dvw sm:w-[360px]">
              {children}
            </main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
