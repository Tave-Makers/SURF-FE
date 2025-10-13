/**
 * 이벤트 이름
 */
export const ACTIVITY_SCORE_EVENTS = {
  ACTIVITY_VIEW: 'activity_view',
  PERSONAL_SCORE_VIEW: 'personal_score_view',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type ActivityScoreEventPropsMap = {
  [ACTIVITY_SCORE_EVENTS.ACTIVITY_VIEW]: {
    page_name: string;
  };
  [ACTIVITY_SCORE_EVENTS.PERSONAL_SCORE_VIEW]: {
    total_score: number;
  };
};
