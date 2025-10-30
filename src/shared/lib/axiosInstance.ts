import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { logApiResult, logApiError } from '@/shared/analytics/lib/logApiEvent';
import { trackCommonEvent } from '@/shared/analytics/lib/trackCommonEvent';
import { COMMON_EVENTS } from '@/shared/analytics/model/types';

/**
 * Axios 요청 설정 타입 확장
 * - 요청 시작 시각(startTime)과 고유 식별자(requestId)를 metadata에 저장
 */
interface RequestConfigWithMeta extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
    requestId: string;
  };
}

/**
 * Axios 인스턴스 생성
 * - 기본 URL 및 공통 헤더 정의
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/**
 * 요청 인터셉터
 * 1. accessToken이 있으면 Authorization 헤더 자동 주입
 * 2. 각 요청에 고유한 requestId 생성 및 헤더/metadata에 저장
 * 3. request_trace 이벤트로 (page_name, request_id) 기록
 */
axiosInstance.interceptors.request.use(
  (config: RequestConfigWithMeta) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;

    const requestId = `fe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '(server)';

    // 🔹 API 호출 출처 기록
    trackCommonEvent(COMMON_EVENTS.REQUEST_TRACE, {
      request_id: requestId,
      page_name: pathname,
    });

    config.headers['X-Request-ID'] = requestId;
    config.metadata = { startTime: Date.now(), requestId };

    return config;
  },
  (error: unknown) => Promise.reject(error as Error),
);

/**
 * 응답 인터셉터
 * - 모든 요청 결과를 Amplitude에 자동 로깅
 *
 * [로그 규칙]
 *  - 정상 응답(2xx): api_result (SUCCESS)
 *  - 서버 오류(4xx,5xx): api_result (FAILURE)
 *  - 네트워크 오류(timeout, CORS 등): api_error
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as RequestConfigWithMeta;
    const startTime = config.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;
    const requestId = config.metadata?.requestId;

    logApiResult({
      endpoint: config.url || '',
      method: config.method?.toUpperCase() || 'GET',
      status_code: response.status,
      duration_ms: duration,
      result: response.status >= 200 && response.status < 300 ? 'SUCCESS' : 'FAILURE',
      request_id: requestId || '',
    });

    return response;
  },

  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const config = error.config as RequestConfigWithMeta | undefined;
      const startTime = config?.metadata?.startTime;
      const duration = startTime ? Date.now() - startTime : undefined;
      const requestId = config?.metadata?.requestId;

      if (error.response) {
        // 서버가 응답을 반환했지만 실패한 경우
        logApiResult({
          endpoint: config?.url || '',
          method: config?.method?.toUpperCase() || 'GET',
          status_code: error.response.status,
          duration_ms: duration,
          result: 'FAILURE',
          request_id: requestId || '',
        });
      } else {
        // 서버 응답 자체가 없는 경우 (네트워크 오류, CORS, timeout 등)
        logApiError({
          endpoint: config?.url || '',
          method: config?.method?.toUpperCase() || 'GET',
          error_message: error.message,
          request_id: requestId || '',
        });
      }
    }

    return Promise.reject(error as Error);
  },
);
