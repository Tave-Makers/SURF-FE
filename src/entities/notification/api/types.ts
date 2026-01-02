import { NotificationCategory, NotificationType } from './constants';

export type GetNotificationsRequest = {
  category: NotificationCategory | null; // null일 경우 전체 카테고리
};

export type GetNotificationsResponse = {
  notifications: Notification[];
};

export type Notification = {
  id: number;
  type: NotificationType;
  category: NotificationCategory;
  body: string;
  deepLink: string;
  read: boolean;
  createdAt: string;
};
