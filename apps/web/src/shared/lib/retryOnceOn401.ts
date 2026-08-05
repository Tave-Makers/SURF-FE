import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { AUTH_REFRESH_PATH } from '@/shared/config/authPaths';

const LOGIN_PATH = '/login';

type AxiosConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/**
 * 여러 요청이 동시에 401을 받아도 refresh 는 한 번만 호출한다.
 * 백엔드가 RT 를 회전시키기 때문에, 병렬로 호출하면 뒤늦은 요청이
 * 이미 폐기된 RT 를 들고 가서 세션 전체가 끊긴다.
 */
let refreshPromise: Promise<void> | null = null;

function isRefreshRequest(config: AxiosConfig): boolean {
  return (config.url ?? '').includes(AUTH_REFRESH_PATH);
}

function refreshOnce(client: AxiosInstance): Promise<void> {
  refreshPromise ??= client
    .post(AUTH_REFRESH_PATH, null)
    .then(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === LOGIN_PATH) return;

  window.location.replace(LOGIN_PATH);
}

export async function retryOnceOn401(error: unknown, client: AxiosInstance) {
  // axios 에러인지 먼저 검증
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const config = (error.config ?? {}) as AxiosConfig;
  const status = error.response?.status;

  if (status !== 401) throw error;

  // refresh 자체가 401이면 무한 재귀를 막고 로그인으로 보낸다
  if (isRefreshRequest(config)) {
    redirectToLogin();
    throw error;
  }

  // 401이면 한 번만 재시도
  if (config._retry) throw error;
  config._retry = true;

  // 만료된 AT 로 같은 요청을 다시 보내지 말고, 먼저 새 AT 를 받는다
  try {
    await refreshOnce(client);
  } catch {
    redirectToLogin();
    throw error;
  }

  return client.request(config);
}
