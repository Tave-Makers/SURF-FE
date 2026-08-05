import { LoginRequest, LoginResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<LoginResponse>('/v1/manager/sign-in', body);
  return res.data;
}
