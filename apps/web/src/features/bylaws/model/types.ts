// 회칙 관련 데이터 구조
// 아코디언 안에 들어가는 개별 아이템

export type AccordionItemData = {
  title: string;
  scoreChange?: string;
  descriptions?: string[];
};

/**
 *  이벤트 이름
 */
export const BYLAWS_EVENTS = {
  VIEW_RULES_MAIN: 'view_rules_main',
  CLICK_RULES_SECTION: 'click_rules_section',
  SCROLL_RULES_PAGE: 'scroll_rules_page',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type BylawsEventPropsMap = {
  [BYLAWS_EVENTS.VIEW_RULES_MAIN]: { page_name: string };
  [BYLAWS_EVENTS.CLICK_RULES_SECTION]: { section_name: string };
  [BYLAWS_EVENTS.SCROLL_RULES_PAGE]: { percent: number };
};
