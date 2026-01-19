import '@/shared/styles/globals.css';
import type { ReactNode } from 'react';
import { GlobalComponents } from '@/shared/ui/global-components/GlobalComponents';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-200">
        <main className="bg-background-normal box-content flex h-full w-dvw sm:h-[min(100dvh,calc(100dvw*812/375))] sm:w-[min(100dvw,calc(100dvh*375/812))]">
          {children}
        </main>
        <GlobalComponents />
      </body>
    </html>
  );
};

export default RootLayout;
