'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import ErrorStateIcon from '@/shared/assets/icons/error/error-state-icon.svg';
import { PAGE_ROUTES } from '@/shared/config/path';

export type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error('페이지 렌더링 실패:', error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-5">
          <ErrorStateIcon aria-hidden="true" />
          <p className="text-body-body8 text-foreground-tertiary">
            일시적인 오류가 발생했어요
            <br />
            잠시 후 다시 시도해 주세요
          </p>
        </div>

        <div className="flex flex-col items-center gap-11">
          <button
            type="button"
            onClick={reset}
            className="text-body-body6 rounded-3 bg-background-primary text-foreground-static-white hover:bg-background-primary-darker inline-flex items-center justify-center overflow-hidden p-9"
          >
            다시 시도하기
          </button>
          <Link href={PAGE_ROUTES.HOME} className="text-body-body8 text-foreground-tertiary">
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
};
