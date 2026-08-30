import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UnreadNotificationResponse } from './types';

/** 안 읽은 알림이 하나라도 있는지 — 홈 뱃지용 exists 조회 */
export async function getUnreadNotification() {
  const res = await axiosInstance.get<UnreadNotificationResponse>('/v1/user/notifications/unread');
  return res.data;
}
