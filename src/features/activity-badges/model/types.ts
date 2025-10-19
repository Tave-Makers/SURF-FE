/* 엠플리튜드 로그 이벤트 */
export const BADGE_EVENTS = {
  VIEW_BADGE: 'view_badge',
} as const;

/* 이벤트별 속성 타입 매핑 */
export type BadgeEventPropsMap = {
  [BADGE_EVENTS.VIEW_BADGE]: { member_id: string };
};
