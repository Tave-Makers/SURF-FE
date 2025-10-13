// 이벤트 이름
export const MY_POSTS_EVENTS = {
  VIEW_MY_POSTS_PAGE: 'view_post_list',
  SCROLL_MY_POSTS_PAGE: 'view_post_list_scroll',
  CLICK_POST_CARD: 'click_post_card',
} as const;

// 이벤트별 속성 타입 매핑
export type MyPostsEventPropsMap = {
  [MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE]: { page_name: string };
  [MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE]: { percent: number };
  [MY_POSTS_EVENTS.CLICK_POST_CARD]: { post_id: string };
};
