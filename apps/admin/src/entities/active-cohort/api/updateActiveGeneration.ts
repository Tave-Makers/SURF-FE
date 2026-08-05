import type { UpdateActiveGenerationRequest } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function updateActiveGeneration(body: UpdateActiveGenerationRequest): Promise<void> {
  await axiosInstance.put('/v1/admin/active-generation', body);
}
