import axios, { type AxiosInstance } from 'axios';

type AxiosConfig = {
  _retry?: boolean;
  [key: string]: unknown;
};

export async function retryOnceOn401(error: unknown, client: AxiosInstance) {
  // axios 에러인지 먼저 검증
  if (!axios.isAxiosError(error)) {
    throw error;
  }

  const config = (error.config ?? {}) as AxiosConfig;
  const status = error.response?.status;

  // 401이면 한 번만 재시도
  if (status === 401 && !config._retry) {
    config._retry = true;
    return client.request({ ...config } as Parameters<AxiosInstance['request']>[0]);
  }

  throw error;
}
