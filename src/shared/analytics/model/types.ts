/**
 * 이벤트 이름
 */
export const COMMON_EVENTS = {
  DWELL_TIME: 'dwell_time',
  TIME_TO_FIRST_ACTION: 'time_to_first_action',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type CommonEventPropsMap = {
  [COMMON_EVENTS.DWELL_TIME]: {
    page_name: string;
    dwell_time_ms: number;
  };
  [COMMON_EVENTS.TIME_TO_FIRST_ACTION]: {
    page_name: string;
    time_to_first_action_ms: number;
  };
};
