import { NotificationCategory, NotificationType } from './constants';
import { CommonResponse } from '@/shared/api/types';
export type GetNotificationsRequest = {
  category: NotificationCategory | null; // null일 경우 전체 카테고리
};

export type GetNotificationsResponse = CommonResponse<Notification[]>;

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
