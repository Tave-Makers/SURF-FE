'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Nullable } from '@/shared/types/nullable';
import { ErrorState } from '@/shared/ui/error/ErrorState';

/**
 * 동적 fallback 렌더러에 전달되는 값입니다.
 */
type FallbackRenderProps = {
  /** 캐치된 에러 객체 */
  error: Error;
  /**
   * ErrorBoundary 상태를 초기화합니다.
   *
   * 버튼 클릭 등 사용자 액션에서 호출하면 fallback 상태를 종료하고,
   * 자식 트리를 다시 렌더링해 재시도를 수행할 수 있습니다.
   */
  resetErrorBoundary: () => void;
};

/**
 * ErrorBoundary 동작 설정입니다.
 *
 * @property children 에러를 감시할 자식 트리
 * @property fallback 정적 fallback UI
 * @property fallbackRender error/reset 함수를 전달받는 동적 fallback 렌더러
 * @property onError 에러 발생 시 로깅/추적 콜백
 * @property onReset resetErrorBoundary 호출 또는 resetKeys 변경으로 boundary가 리셋될 때 호출
 * @property resetKeys 이 값이 변경되면(에러 상태일 때) boundary를 자동 리셋
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   resetKeys={[memberId, isOpen]}
 *   fallbackRender={({ resetErrorBoundary }) => (
 *     <ErrorState
 *       message="회원 정보를 불러오지 못했습니다."
 *       action={<button onClick={resetErrorBoundary}>다시 시도</button>}
 *     />
 *   )}
 * >
 *   <Suspense fallback={<div>로딩중...</div>}>
 *     <MemberInfoContent memberId={memberId} />
 *   </Suspense>
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <QueryErrorResetBoundary>
 *   {({ reset }) => (
 *     <ErrorBoundary onReset={reset} resetKeys={[memberId]}>
 *       <Suspense fallback={<div>로딩중...</div>}>
 *         <MemberInfoContent memberId={memberId} />
 *       </Suspense>
 *     </ErrorBoundary>
 *   )}
 * </QueryErrorResetBoundary>
 * ```
 */
interface ErrorBoundaryProps {
  /** 에러를 감시할 자식 트리 */
  children: ReactNode;
  /** 정적 fallback UI */
  fallback?: ReactNode;
  /** error 값을 받아 동적으로 fallback UI를 생성하는 렌더 함수 */
  fallbackRender?: (props: FallbackRenderProps) => ReactNode;
  /** 에러 발생 시 로깅/추적용 콜백 */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** boundary reset 시 실행할 콜백 */
  onReset?: () => void;
  /** 에러 상태에서 키가 바뀌면 boundary를 자동으로 리셋 */
  resetKeys?: readonly unknown[];
}

/**
 * ErrorBoundary 내부 상태입니다.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Nullable<Error>;
}

/**
 * 에러가 없는 초기 상태입니다.
 */
const INITIAL_STATE: ErrorBoundaryState = {
  hasError: false,
  error: null,
};

function hasResetKeysChanged(
  prevResetKeys: readonly unknown[] = [],
  nextResetKeys: readonly unknown[] = [],
) {
  if (prevResetKeys.length !== nextResetKeys.length) return true;

  for (let index = 0; index < prevResetKeys.length; index += 1) {
    if (!Object.is(prevResetKeys[index], nextResetKeys[index])) {
      return true;
    }
  }

  return false;
}

/**
 * 에러 바운더리 컴포넌트
 *
 * 자식 컴포넌트에서 발생한 에러를 캐치하여 fallback UI를 렌더링합니다.
 * `resetKeys` 변경 또는 `resetErrorBoundary()` 호출로 재시도 흐름을 공통 처리할 수 있습니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = INITIAL_STATE;
  }

  /**
   * 렌더링 중 발생한 에러를 상태로 전환합니다.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * 에러를 외부 로깅 훅으로 전달합니다.
   */
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  /**
   * 에러 상태에서 resetKeys가 변경되면 boundary를 자동 초기화합니다.
   */
  componentDidUpdate(
    prevProps: Readonly<ErrorBoundaryProps>,
    prevState: Readonly<ErrorBoundaryState>,
  ) {
    if (!this.state.hasError || !prevState.hasError) return;

    if (hasResetKeysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.resetErrorBoundary();
    }
  }

  /**
   * ErrorBoundary 상태를 초기화하고 onReset 콜백을 호출합니다.
   */
  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState(INITIAL_STATE);
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const error = this.state.error ?? new Error('Unknown error');

    if (this.props.fallbackRender) {
      return this.props.fallbackRender({
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      });
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return <ErrorState />;
  }
}
