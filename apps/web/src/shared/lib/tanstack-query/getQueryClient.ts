import { isServer, type QueryClient } from '@tanstack/react-query';

import { makeQueryClient } from './makeQueryClient';

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * 환경에 따라 적절한 QueryClient를 반환하는 함수
 * - 서버 환경: 매 요청마다 새로운 인스턴스 생성 (요청 간 격리)
 * - 브라우저 환경: 싱글톤 인스턴스 재사용 (SPA 동작)
 * @returns QueryClient 인스턴스
 */

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
