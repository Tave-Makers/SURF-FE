/**
 * 페이지 전체를 차지하는 로딩/오류 상태 표시.
 *
 * 로딩은 시각적으로 비어 있지만 화면 낭독기에는 상태를 알려야 하므로
 * role="status" + 읽기 전용 텍스트를 둔다. 오류는 즉시 전달돼야 해서 role="alert".
 */

import type { ReactNode } from 'react';

type PageLoadingProps = {
  /** 화면에는 보이지 않고 화면 낭독기로만 읽히는 안내 문구 */
  label?: string;
};

export const PageLoading = ({ label = '불러오는 중이에요' }: PageLoadingProps) => (
  <div role="status" aria-live="polite" className="flex h-full w-full items-center justify-center">
    <span className="sr-only">{label}</span>
  </div>
);

type PageErrorProps = {
  message: string;
  /** 오류에서 빠져나갈 수 있는 동작. 없으면 문구만 보여준다 */
  action?: ReactNode;
};

export const PageError = ({ message, action }: PageErrorProps) => (
  <div role="alert" className="flex h-full w-full items-center justify-center">
    <div className="flex flex-col items-center gap-11 text-center">
      <span className="text-body-body8 text-foreground-tertiary">{message}</span>
      {action}
    </div>
  </div>
);
