import type { AxiosError, AxiosInstance } from 'axios';

type AxiosConfig = {
  _retry?: boolean;
  [key: string]: unknown;
};

export async function retryOnceOn401(error: unknown, client: AxiosInstance) {
  const err = error as AxiosError;
  const config = (err.config ?? {}) as AxiosConfig;

  const status = err.response?.status;

  // ✅ 401이면 한 번만 재시도
  if (status === 401 && !config._retry) {
    config._retry = true;

    // 백엔드가 refreshToken만 보고 accessToken을 Set-Cookie로 재발급했을 수 있으니
    // 같은 요청을 한 번 더 실행
    // config의 타입을 명확히 지정하여 타입 오류 방지
    return client.request({ ...config } as Parameters<AxiosInstance['request']>[0]);
  }

  throw err;
}
