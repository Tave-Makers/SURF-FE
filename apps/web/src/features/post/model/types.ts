// My Posts 관련 이벤트 이름
export const MY_POSTS_EVENTS = {
  VIEW_MY_POSTS_PAGE: 'view_post_list',
  SCROLL_MY_POSTS_PAGE: 'view_post_list_scroll',
  CLICK_POST_CARD: 'click_post_card',
} as const;

// My Posts 관련 이벤트별 속성 타입 매핑
export type MyPostsEventPropsMap = {
  [MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE]: { page_name: string };
  [MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE]: { percent: number };
  [MY_POSTS_EVENTS.CLICK_POST_CARD]: { post_id: string };
};

// Scraps 관련 이벤트 이름
export const SCRAPS_EVENTS = {
  VIEW_SCRAPS_PAGE: 'view_scrap_list',
  SCROLL_SCRAPS_PAGE: 'view_scrap_list_scroll',
  CLICK_POST_CARD: 'click_post_card',
} as const;

// Scraps 관련 이벤트별 속성 타입 매핑
export type ScrapsEventPropsMap = {
  [SCRAPS_EVENTS.VIEW_SCRAPS_PAGE]: { page_name: string };
  [SCRAPS_EVENTS.SCROLL_SCRAPS_PAGE]: { percent: number };
  [SCRAPS_EVENTS.CLICK_POST_CARD]: { post_id: string };
};

// Post Detail 관련 이벤트 이름
export const POST_DETAIL_EVENTS = {
  PAGE_VIEW: 'page_view',
  LIKE: 'like',
  SCRAP: 'scrap',
  LIKE_LIST_VIEW: 'like_list_view',
  CLICK_POST_EDIT: 'click_post_edit',
  CLICK_POST_DELETE: 'click_post_delete',
} as const;

// Post Detail 관련 이벤트별 속성 타입 매핑
export type PostDetailEventPropsMap = {
  [POST_DETAIL_EVENTS.PAGE_VIEW]: { page_name: string; post_id: number };
  [POST_DETAIL_EVENTS.LIKE]: { target_type: string; target_id: number; state: string };
  [POST_DETAIL_EVENTS.SCRAP]: { target_type: string; target_id: number; state: string };
  [POST_DETAIL_EVENTS.LIKE_LIST_VIEW]: { post_id: number };
  [POST_DETAIL_EVENTS.CLICK_POST_EDIT]: { post_id: number };
  [POST_DETAIL_EVENTS.CLICK_POST_DELETE]: { post_id: number };
};
