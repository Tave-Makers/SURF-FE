'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

import getQueryClient from '@/shared/lib/tanstack-query/getQueryClient';

export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        {children}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
