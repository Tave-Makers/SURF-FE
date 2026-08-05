import type { NotificationCategory } from '../api/constants';
import type { Notification } from '../api/types';
import type { NOTIFICATION_BADGE } from '../ui/NotificationItem';
import { NotificationItemProps } from '../ui/NotificationItem';
import type { NotificationTab } from './notificationTab';

export function mapTabToCategory(tab: NotificationTab): NotificationCategory | null {
  if (tab === 'ALL') {
    return null;
  }
  return tab;
}

const BADGE_MAP: Partial<Record<Notification['type'], NOTIFICATION_BADGE>> = {
  POST_LIKE: 'LIKE',
  COMMENT_LIKE: 'LIKE',
  POST_COMMENT: 'MENTION',
  COMMENT_REPLY: 'MENTION',
  MESSAGE: 'MENTION',
};
function mapTypeToBadge(type: Notification['type']): NOTIFICATION_BADGE | undefined {
  return BADGE_MAP[type];
}

type NotificationUIModel = Omit<NotificationItemProps, 'onClick'> & { deepLink: string };
export function mapNotificationToItem(dto: Notification): NotificationUIModel {
  return {
    id: dto.id,
    title: dto.body,
    time: new Date(dto.createdAt),
    isRead: dto.read,
    badge: mapTypeToBadge(dto.type),
    userImageUrl: dto.actorProfileImageUrl ?? undefined,
    deepLink: dto.deepLink,
  };
}
