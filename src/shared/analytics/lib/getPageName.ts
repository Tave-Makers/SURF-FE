import { usePathname } from 'next/navigation';

/**
 * 데이터 분석용 page_name 생성 훅
 *
 * @description
 * - Amplitude, GA, 내부 로그 트래킹용 page_name을 생성하기 위한 전용 유틸입니다.
 * - 실제 UI 경로나 라우팅과 분리하여, 분석 목적의 페이지 식별자 관리만 담당합니다.
 *
 * @returns {string} 분석용 page_name (예: "/mypage/activity-score/bylaws")
 *
 * @example
 * const pageName = usePageName();
 * trackCommonEvent('VIEW_PAGE', { page_name: pageName });
 */
export function usePageName() {
  const pathname = usePathname();
  return pathname;
}
