import axios from 'axios';
import { API_BASE_URL } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error as Error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error as Error),
);
