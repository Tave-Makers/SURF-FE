/**
 *  이벤트 이름
 */
export const NOTIFICATION_EVENTS = {
  PAGE_VIEW: 'page_view',
  NOTIFICATION_CLICK: 'notification_click',
  NOTIFICATION_READ: 'notification_read',
  ALARM_ICON_CLICK: 'alarm_icon_click',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type NotificationEventPropsMap = {
  [NOTIFICATION_EVENTS.PAGE_VIEW]: { page_name: string };
  [NOTIFICATION_EVENTS.NOTIFICATION_CLICK]: { notification_type: string };
  [NOTIFICATION_EVENTS.NOTIFICATION_READ]: { notification_id: string };
  [NOTIFICATION_EVENTS.ALARM_ICON_CLICK]: { has_unread: boolean };
};
