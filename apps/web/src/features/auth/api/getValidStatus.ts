import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { ValidStatusResponse } from './types';

export async function getValidStatus() {
  const { data } = await axiosInstance.get<ValidStatusResponse>('/v1/user/members/valid-status');
  return data.data;
}
