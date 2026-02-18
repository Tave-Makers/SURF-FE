/**
 *  이벤트 이름
 */
export const MEMBER_SEARCH_EVENTS = {
  PAGE_VIEW: 'page_view',
  MEMBER_SEARCH: 'member_search',
  FILTER_APPLY: 'filter_apply',
  MEMBER_CLICK: 'member_click',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type MemberSearchEventPropsMap = {
  [MEMBER_SEARCH_EVENTS.PAGE_VIEW]: { page_name: string };
  [MEMBER_SEARCH_EVENTS.MEMBER_SEARCH]: { keyword_length: number };
  [MEMBER_SEARCH_EVENTS.FILTER_APPLY]: { filter_type: string; filter_value: string };
  [MEMBER_SEARCH_EVENTS.MEMBER_CLICK]: { member_id: string };
};
