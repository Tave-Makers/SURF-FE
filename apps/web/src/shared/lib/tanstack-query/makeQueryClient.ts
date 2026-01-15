import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query 클라이언트를 생성하는 팩토리 함수
 * @returns 기본 옵션이 설정된 QueryClient 인스턴스
 */

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터가 fresh 상태로 간주되는 시간
        staleTime: 60 * 1000,
        // 사용되지 않는 데이터를 메모리에 유지하는 시간
        gcTime: 5 * 60 * 1000,
        // 실패 시 재시도 횟수
        retry: 1,
        // 브라우저 창 포커스 시 자동 재조회 비활성화
        refetchOnWindowFocus: false,
      },
    },
  });
}
