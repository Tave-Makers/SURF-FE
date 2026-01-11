import type { ReactNode } from 'react';
import '@/shared/styles/globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import 'keen-slider/keen-slider.min.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnalyticsProvider } from '@/app/providers/AnalyticsProvider';
import { PageTrackingProvider } from '@/shared/analytics/providers/PageTrackingProvider';
import { GlobalComponents } from '@surf/ui/global-components';
import FCMInitializer from '@/app/providers/FCMInitializer';
import { PathWatcher } from './providers/PathWatcher';

export default function RootLayout({ children }: { children: ReactNode }) {
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
        <AnalyticsProvider />
        <QueryProvider>
          <FCMInitializer />
          <PathWatcher />
          <PageTrackingProvider>
            <main className="bg-background-normal box-content flex h-full w-dvw sm:h-[min(100dvh,calc(100dvw*812/375))] sm:w-[min(100dvw,calc(100dvh*375/812))]">
              {children}
            </main>
            <GlobalComponents />
          </PageTrackingProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
