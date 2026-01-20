import axios from 'axios';
import { retryOnceOn401 } from './retryOnceOn401';

export const axiosInstance = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  timeout: 15000,
});

// 401이면 1번 재시도
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => retryOnceOn401(error, axiosInstance),
);
