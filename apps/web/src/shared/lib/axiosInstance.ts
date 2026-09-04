import axios from 'axios';
import { retryOnceOn401 } from './retryOnceOn401';
import { throwOnEnvelopeErrorCode } from './throwOnEnvelopeErrorCode';

export const axiosInstance = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'X-Client-Type': 'WEB',
  },
});

// HTTP 200 으로 위장해서 오는 실패 응답을 에러로 승격한다.
// retryOnceOn401 보다 먼저 등록해야, 여기서 만든 401 이 아래 인터셉터의 재시도를 탄다.
axiosInstance.interceptors.response.use(throwOnEnvelopeErrorCode);

// 401이면 1번 재시도
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => retryOnceOn401(error, axiosInstance),
);
