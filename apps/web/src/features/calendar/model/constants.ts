/**
 * 캘린더 관련 트래킹 이벤트
 */
export const CALENDAR_EVENTS = {
  PAGE_VIEW: 'page_view',
  CALENDAR_DATE_CLICK: 'calendar_date_click',
  EVENT_CARD_CLICK: 'event_card_click',
} as const;

/**
 * 캘린더 이벤트별 속성 타입 매핑
 */
export type CalendarEventPropsMap = {
  [CALENDAR_EVENTS.PAGE_VIEW]: { page_name: string };
  [CALENDAR_EVENTS.CALENDAR_DATE_CLICK]: { selected_date: string };
  [CALENDAR_EVENTS.EVENT_CARD_CLICK]: { event_id: number; post_id?: number };
};
