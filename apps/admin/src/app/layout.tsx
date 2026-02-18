import '@/shared/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { MockingProvider } from '@/shared/providers/MockingProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';
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
        <QueryProvider>
          <MockingProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
              <main className="bg-background-normal box-content flex h-full w-dvw sm:h-[min(100dvh,calc(100dvw*812/375))] sm:w-[min(100dvw,calc(100dvh*375/812))]">
                {children}
              </main>
            </ThemeProvider>
            <GlobalComponents />
            <div id="bottom-sheet-root" className="relative z-[9999]" />
            <div id="toast-root" className="relative z-[10001]" />
            <div id="alert-root" className="relative z-[20000]" />
          </MockingProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
