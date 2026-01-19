import '@/shared/styles/globals.css';
import 'keen-slider/keen-slider.min.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { PathWatcher } from './providers/PathWatcher';
import { AnalyticsProvider } from '@/app/providers/AnalyticsProvider';
import { FCMInitializer } from '@/app/providers/FCMInitializer';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { PageTrackingProvider } from '@/shared/analytics/providers/PageTrackingProvider';
import { GlobalComponents } from '@/widgets/global-components/GlobalComponents';

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

      <body className="flex min-h-dvh items-center justify-center bg-gray-200">
        <AnalyticsProvider />
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <QueryProvider>
            <FCMInitializer />
            <PathWatcher />
            <PageTrackingProvider>
              <main className="bg-background-normal box-content flex h-full w-dvw sm:h-[min(100dvh,calc(100dvw*812/375))] sm:w-[min(100dvw,calc(100dvh*375/812))]">
                {children}
              </main>
              <GlobalComponents />
              <div id="bottom-sheet-root" className="relative z-[9999]" />
              <div id="toast-root" className="relative z-[10001]" />
              <div id="alert-root" className="relative z-[20000]" />
            </PageTrackingProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
