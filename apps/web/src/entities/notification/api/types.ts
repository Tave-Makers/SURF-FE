import { NotificationCategory, NotificationType } from './constants';
import { CommonResponse } from '@/shared/api/types';
export type GetNotificationsRequest = {
  category: NotificationCategory | null; // null일 경우 전체 카테고리
  page?: number;
  size?: number;
};

/**
 * 서버 응답의 data는 배열이 아니라 슬라이스 객체입니다.
 * { content, pageNumber, pageSize, hasNext }
 */
export type NotificationSlice = {
  content: Notification[];
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
};

export type GetNotificationsResponse = CommonResponse<NotificationSlice>;

/** GET /v1/user/notifications/unread */
export type UnreadNotificationStatus = {
  hasUnread: boolean;
};

export type UnreadNotificationResponse = CommonResponse<UnreadNotificationStatus>;

export type Notification = {
  id: number;
  actorProfileImageUrl?: string | null;
  type: NotificationType;
  category: NotificationCategory;
  body: string;
  deepLink: string;
  read: boolean;
  createdAt: string;
};
