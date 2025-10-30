import type { ReactNode } from 'react';
import '@/shared/styles/globals.css';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import 'keen-slider/keen-slider.min.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnalyticsProvider } from '@/app/providers/AnalyticsProvider';
import { PageTrackingProvider } from '@/shared/analytics/providers/PageTrackingProvider';

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
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
      </head>
      <body className="flex min-h-screen items-center justify-center bg-gray-100">
        <AnalyticsProvider />
        <QueryProvider>
          <AuthProvider>
            <PageTrackingProvider>
              <main className="bg-background-background-tertiary box-content flex h-full w-dvw sm:w-[360px]">
                {children}
              </main>
            </PageTrackingProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
