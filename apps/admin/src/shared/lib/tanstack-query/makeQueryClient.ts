import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    // 데이터 신선도 설정 (1분)
    // 이 시간 동안은 데이터가 fresh하다고 간주하여 refetch하지 않음
    staleTime: 60 * 1000,

    // 가비지 컬렉션 시간 (5분)
    // 사용되지 않는 캐시 데이터가 메모리에 유지되는 시간
    gcTime: 5 * 60 * 1000,

    // 에러 발생 시 재시도 전략
    retry: (failureCount, error) => {
      // 401, 403 에러는 재시도하지 않음 (인증 에러)
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as { response?: { status?: number } }).response?.status;
        if (status === 401 || status === 403) return false;
      }
      // 그 외 에러는 최대 2회까지 재시도
      return failureCount < 2;
    },

    // 재시도 딜레이
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // 브라우저 창 포커스 시 자동 재조회 비활성화
    refetchOnWindowFocus: false,

    // 컴포넌트 마운트 시 자동 refetch
    refetchOnMount: true,

    // 네트워크 재연결 시 자동 refetch
    refetchOnReconnect: true,
  },
  mutations: {
    // Mutation은 재시도하지 않음 (데이터 변경 작업의 중복 실행 방지)
    retry: false,
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
