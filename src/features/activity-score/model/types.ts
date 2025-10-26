/**
 * 이벤트 이름
 */
export const ACTIVITY_SCORE_EVENTS = {
  VIEW_ACTIVITY: 'view_activity',
  VIEW_PERSONAL_SCORE: 'view_personal_score',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type ActivityScoreEventPropsMap = {
  [ACTIVITY_SCORE_EVENTS.VIEW_ACTIVITY]: {
    page_name: string;
  };
  [ACTIVITY_SCORE_EVENTS.VIEW_PERSONAL_SCORE]: {
    total_score: number;
  };
};
