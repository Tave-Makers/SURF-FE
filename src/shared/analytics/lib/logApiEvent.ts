import { trackCommonEvent } from '@/shared/analytics/lib/trackCommonEvent';
import { COMMON_EVENTS, type CommonEventPropsMap } from '@/shared/analytics/model/types';
import { API_BASE_URL } from '@/shared/config/env';

/**
 * API 응답 관련 이벤트 로깅
 */
export const logApiResult = (params: CommonEventPropsMap[typeof COMMON_EVENTS.API_RESULT]) => {
  const { endpoint, method, status_code, duration_ms, result, request_id } = params;

  if (!API_BASE_URL && !endpoint.startsWith('http')) {
    console.warn('[logApiResult] API_BASE_URL이 설정되지 않았습니다.');
    return;
  }
  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  trackCommonEvent(COMMON_EVENTS.API_RESULT, {
    endpoint: fullEndpoint,
    method,
    status_code,
    result,
    duration_ms,
    request_id,
  });
};

export const logApiError = (params: CommonEventPropsMap[typeof COMMON_EVENTS.API_ERROR]) => {
  const { endpoint, method, error_message, request_id } = params;

  const fullEndpoint = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  trackCommonEvent(COMMON_EVENTS.API_ERROR, {
    endpoint: fullEndpoint,
    method,
    error_message,
    request_id,
  });
};
