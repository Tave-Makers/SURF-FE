/* 엠플리튜드 로그 이벤트 */
export const PROFILE_EVENTS = {
  VIEW_PROFILE: 'view_profile',
} as const;

/* 이벤트별 속성 타입 매핑 */
export type ProfileEventPropsMap = {
  [PROFILE_EVENTS.VIEW_PROFILE]: { member_id: string };
};
