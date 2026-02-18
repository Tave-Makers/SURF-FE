/**
 *  이벤트 이름
 */
export const HOME_EVENTS = {
  PAGE_VIEW: 'page_view',
  SHORTCUT_CLICK: 'shortcut_click',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type HomeEventPropsMap = {
  [HOME_EVENTS.PAGE_VIEW]: { page_name: string };
  [HOME_EVENTS.SHORTCUT_CLICK]: { target: string };
};
