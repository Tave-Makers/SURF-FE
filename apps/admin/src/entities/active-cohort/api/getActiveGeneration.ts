import type { ActiveGenerationResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getActiveGeneration(): Promise<ActiveGenerationResponse> {
  const response = await axiosInstance.get<ActiveGenerationResponse>(
    '/v1/manager/active-generation',
  );
  return response.data;
}
