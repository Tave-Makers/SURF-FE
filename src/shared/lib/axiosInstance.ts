import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { logApiResult, logApiError } from '@/shared/analytics/lib/logApiEvent';
import { trackCommonEvent } from '@/shared/analytics/lib/trackCommentEvent';
import { COMMON_EVENTS } from '@/shared/analytics/model/types';

/**
 * ✅ 커스텀 Axios 설정 타입
 * - Axios의 기본 RequestConfig에 metadata 필드를 추가해서
 *   요청 시작 시각(startTime)을 기록할 수 있도록 확장함
 */
interface RequestConfigWithMeta extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number; // 요청 시작 시간 (timestamp, ms 단위)
    requestId: string; // 요청 고유 식별자
  };
}

/**
 * ✅ Axios 인스턴스 생성
 * - API 기본 URL 및 공통 헤더 설정
 */
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 요청 제한 시간 (15초)
});

/**
 * ✅ 요청 인터셉터 (request interceptor)
 * 1. accessToken이 존재하면 Authorization 헤더 자동 주입
 * 2. 요청이 시작된 시점(Date.now())을 metadata로 기록
 */
axiosInstance.interceptors.request.use(
  (config: RequestConfigWithMeta) => {
    const token = useAuthStore.getState().accessToken;

    // (1) JWT 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 없을 경우 헤더에서 제거 (혹시 남아있을 수 있으므로)
      delete config.headers.Authorization;
    }

    // request_id 생성 (고유 식별자)
    const requestId = `fe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // request_trace 이벤트
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '(server)';
    trackCommonEvent(COMMON_EVENTS.REQUEST_TRACE, {
      request_id: requestId,
      page_name: pathname,
    });

    config.headers['X-Request-ID'] = requestId; // 백엔드로 전달 (미연동이어도 무방)
    // (2) 요청 시작 시각 (duration 계산용), request_id 저장
    config.metadata = {
      startTime: Date.now(),
      requestId,
    };

    return config;
  },
  (error: unknown) => Promise.reject(error as Error),
);

/**
 * ✅ 응답 인터셉터 (response interceptor)
 * - 모든 API 요청에 대해 Amplitude 자동 로깅 수행
 *
 *  성공 시: api_result (SUCCESS)
 *  실패 시: api_result (FAILURE)
 *  네트워크 오류: api_error
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답이 성공적으로 왔을 때
    const config = response.config as RequestConfigWithMeta;

    // duration_ms 계산: 응답 도착 시점 - 요청 시작 시점
    const startTime = config.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : undefined;

    const requestId = config.metadata?.requestId;

    // Amplitude에 성공/실패 결과 로깅
    logApiResult({
      endpoint: config.url || '', // 호출된 엔드포인트
      method: config.method?.toUpperCase() || 'GET', // HTTP 메서드
      status_code: response.status, // HTTP 상태 코드
      duration_ms: duration, // 요청 → 응답까지 걸린 시간(ms)
      result: response.status >= 200 && response.status < 300 ? 'SUCCESS' : 'FAILURE',
      request_id: requestId || '',
    });

    return response;
  },

  (error: unknown) => {
    // 응답이 실패하거나 네트워크 오류일 때
    if (axios.isAxiosError(error)) {
      const config = error.config as RequestConfigWithMeta | undefined;
      const startTime = config?.metadata?.startTime;
      const duration = startTime ? Date.now() - startTime : undefined;
      const requestId = config?.metadata?.requestId;

      if (error.response) {
        /**
         * ⚠️ 서버가 응답을 반환했지만 실패한 경우 (HTTP 400, 500 등)
         * -> api_result 이벤트로 기록
         */
        logApiResult({
          endpoint: config?.url || '',
          method: config?.method?.toUpperCase() || 'GET',
          status_code: error.response.status,
          duration_ms: duration,
          result: 'FAILURE',
          request_id: requestId || '',
        });
      } else {
        /**
         * ❌ 서버 응답 자체가 없는 경우 (네트워크 오류, CORS, timeout 등)
         * -> api_error 이벤트로 기록
         */
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
