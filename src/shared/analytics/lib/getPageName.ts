import { usePathname } from 'next/navigation';

/**
 * 데이터 분석 용 page_name(현재 pathname) 제공 훅
 *
 * @description
 * - 현재 경로(pathname)를 분석용 page_name으로 제공하는 래퍼 유틸입니다.
 * - 향후 pathname → 분석 페이지명 매핑 로직 추가 시, 이 훅만 수정하면 모든 트래킹에 반영됩니다.
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
