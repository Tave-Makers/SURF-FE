import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // 데이터 신선도 설정 (1분)
    // 기본값은 0이지만, 1분으로 설정하여 불필요한 refetch 방지
    staleTime: 60 * 1000,

    // 에러 발생 시 재시도 전략
    // 401, 403 에러는 재시도하지 않고, 그 외는 최대 2회까지 재시도
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401 || status === 403) return false;
      }
      return failureCount < 2;
    },

    // 브라우저 창 포커스 시 자동 재조회 비활성화
    refetchOnWindowFocus: false,
  },
};

/**
 * TanStack Query 클라이언트를 생성하는 팩토리 함수
 * @returns 기본 옵션이 설정된 QueryClient 인스턴스
 */

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}
