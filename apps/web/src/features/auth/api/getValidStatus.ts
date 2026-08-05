import type { ValidStatusResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getValidStatus() {
  const { data } = await axiosInstance.get<ValidStatusResponse>('/v1/user/members/valid-status');
  return data.data;
}
