import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { ActiveGenerationResponse } from './types';

export async function getActiveGeneration(): Promise<ActiveGenerationResponse> {
  const response = await axiosInstance.get<ActiveGenerationResponse>('/v1/manager/active-generation');
  return response.data;
}
