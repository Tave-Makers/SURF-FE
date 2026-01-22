'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { getQueryClient } from '@/shared/lib/tanstack-query/queryClient';

/**
 * TanStack Query Provider 컴포넌트
 *
 * React Query를 앱 전체에서 사용할 수 있도록 설정합니다.
 * - QueryClientProvider: React Query 기능 제공
 * - ReactQueryDevtools: 개발 환경에서 디버깅 도구 제공
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr#initial-setup-server-components--nextjs-app-router
 */
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
};
