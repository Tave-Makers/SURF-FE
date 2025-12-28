import type { AxiosError, AxiosInstance } from 'axios';

type AxiosConfig = {
  _retry?: boolean;
  [key: string]: unknown;
};

export async function retryOnceOn401(error: unknown, client: AxiosInstance) {
  const err = error as AxiosError;
  const config = (err.config ?? {}) as AxiosConfig;

  const status = err.response?.status;

  // 401이면 한 번만 재시도
  if (status === 401 && !config._retry) {
    config._retry = true;
    return client.request({ ...config } as Parameters<AxiosInstance['request']>[0]);
  }

  throw err;
}
