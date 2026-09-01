'use client';

import { ErrorPage } from '@/app-pages/error/ErrorPage';
import type { ErrorPageProps } from '@/app-pages/error/ErrorPage';

const ErrorBoundary = ({ error, reset }: ErrorPageProps) => {
  return <ErrorPage error={error} reset={reset} />;
};

export default ErrorBoundary;
