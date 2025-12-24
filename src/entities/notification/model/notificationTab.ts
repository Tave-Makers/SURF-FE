import { notificationCategories } from '../api/constants';

// 알림 탭 카테고리
export const NOTIFICATION_TABS = ['ALL', ...notificationCategories] as const;
export type NotificationTab = (typeof NOTIFICATION_TABS)[number];
