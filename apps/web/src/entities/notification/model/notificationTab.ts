import { notificationCategories } from '../api/constants';

/**
 * 알림 목록 전체('ALL')를 나타내는 상수
 */
const ALL_NOTIFICATIONS = 'ALL' as const;

/**
 * 알림 탭에서 사용 가능한 모든 카테고리 목록
 * - 'ALL': 전체 알림
 * - 나머지: 개별 카테고리 (ACTIVITY, SCHEDULE)
 */
export const NOTIFICATION_TABS = [ALL_NOTIFICATIONS, ...notificationCategories] as const;

/**
 * 알림 탭 카테고리 타입
 */
export type NotificationTab = (typeof NOTIFICATION_TABS)[number];
