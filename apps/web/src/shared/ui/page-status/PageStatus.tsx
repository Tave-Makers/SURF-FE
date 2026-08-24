/**
 * 페이지 전체를 차지하는 로딩/오류 상태 표시.
 *
 * 로딩은 시각적으로 비어 있지만 화면 낭독기에는 상태를 알려야 하므로
 * role="status" + 읽기 전용 텍스트를 둔다. 오류는 즉시 전달돼야 해서 role="alert".
 */

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
};

export const PageError = ({ message }: PageErrorProps) => (
  <div role="alert" className="flex h-full w-full items-center justify-center">
    <span className="text-body-body8 text-foreground-tertiary">{message}</span>
  </div>
);
