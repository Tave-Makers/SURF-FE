// Comment 관련 이벤트 이름
export const COMMENT_EVENTS = {
  CLICK_COMMENT_SUBMIT: 'click_comment_submit',
  CLICK_COMMENT_DELETE: 'click_comment_delete',
} as const;

// Comment 관련 이벤트별 속성 타입 매핑
export type CommentEventPropsMap = {
  [COMMENT_EVENTS.CLICK_COMMENT_SUBMIT]: {
    post_id: number;
    comment_length: number;
  };
  [COMMENT_EVENTS.CLICK_COMMENT_DELETE]: { post_id: number; comment_id: number };
};
