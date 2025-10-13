// Amplitude 피드백 이벤트 이름
export const FEEDBACK_EVENTS = {
  VIEW_FEEDBACK_PAGE: 'view_feedback',
  SUBMITTED_FEEDBACK_TEXT_LENGTH: 'enter_feedback_text',
} as const;

// Amplitude 이벤트별 속성 타입 매핑
export type FeedbackEventPropsMap = {
  [FEEDBACK_EVENTS.VIEW_FEEDBACK_PAGE]: { page_name: string };
  [FEEDBACK_EVENTS.SUBMITTED_FEEDBACK_TEXT_LENGTH]: { text_length: number };
};
