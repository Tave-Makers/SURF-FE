'use client';

import { SolidButton } from '@surf/ui/button';
import { useEffect } from 'react';
import { ErrorState } from '@/shared/ui/error/ErrorState';

/**
 * Next.js App Router 전역 에러 페이지 props
 *
 * @property error 에러 경계에서 전달되는 에러 객체
 * @property reset 에러 경계를 초기화하고 현재 라우트를 다시 렌더링하는 함수
 */
type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * App Router `error.tsx` 전용 에러 페이지
 *
 * - 런타임 에러를 공통 ErrorState UI로 표시합니다.
 * - "다시 시도" 버튼 클릭 시 `reset()`을 호출해 현재 세그먼트를 재시도합니다.
 */
const Error = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      action={
        <div className="w-34">
          <SolidButton size="s" variant="secondary" onClick={reset}>
            다시 시도
          </SolidButton>
        </div>
      }
    />
  );
};

export default Error;
