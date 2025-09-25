import type { ReactNode } from 'react';
import '@/shared/styles/globals.css';

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
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-100">
        <main className="bg-background-normal h-dvh w-dvw sm:h-[50.75rem] sm:w-[360px]">
          {children}
        </main>
      </body>
    </html>
  );
}
