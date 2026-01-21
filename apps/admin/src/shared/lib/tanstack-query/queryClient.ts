import { QueryClient } from '@tanstack/react-query';
import { makeQueryClient } from './makeQueryClient';

/**
 * Browser용 QueryClient 싱글톤 인스턴스
 */
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * 환경에 따라 적절한 QueryClient를 반환하는 함수
 * - 서버 환경: 매 요청마다 새로운 인스턴스 생성 (요청 간 격리)
 * - 브라우저 환경: 싱글톤 인스턴스 재사용 (SPA 동작)
 * @returns QueryClient 인스턴스
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: 항상 새 인스턴스 생성
    // 서로 다른 요청 간의 데이터 누수 방지
    return makeQueryClient();
  } else {
    // Browser: 싱글톤 패턴
    // 페이지 이동 시에도 캐시 유지
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
