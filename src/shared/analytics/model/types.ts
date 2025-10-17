/**
 * 이벤트 이름 (공통)
 */
export const COMMON_EVENTS = {
  // 페이지 공통
  DWELL_TIME: 'dwell_time',
  TIME_TO_FIRST_ACTION: 'time_to_first_action',

  // API 공통
  API_RESULT: 'api_result',
  API_ERROR: 'api_error',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type CommonEventPropsMap = {
  // 페이지 공통
  [COMMON_EVENTS.DWELL_TIME]: {
    page_name: string;
    dwell_time_ms: number;
  };
  [COMMON_EVENTS.TIME_TO_FIRST_ACTION]: {
    page_name: string;
    time_to_first_action_ms: number;
  };

  // API 공통
  [COMMON_EVENTS.API_RESULT]: {
    endpoint: string;
    method: string;
    status_code: number;
    duration_ms?: number;
    result: 'SUCCESS' | 'FAILURE';
  };
  [COMMON_EVENTS.API_ERROR]: {
    endpoint: string;
    method: string;
    error_message?: string;
  };
};
