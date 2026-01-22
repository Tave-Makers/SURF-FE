import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  timeout: 15000,
});
