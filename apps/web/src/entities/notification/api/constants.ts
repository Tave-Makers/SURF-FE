export const notificationTypes = [
  'POST_LIKE',
  'POST_COMMENT',
  'COMMENT_LIKE',
  'COMMENT_REPLY',
  'MESSAGE',
  'BADGE_UPDATE',
  'SCORE_UPDATE',
  'NOTICE',
] as const;
export type NotificationType = (typeof notificationTypes)[number];

export const notificationCategories = ['ACTIVITY', 'SCHEDULE'] as const;
export type NotificationCategory = (typeof notificationCategories)[number];
