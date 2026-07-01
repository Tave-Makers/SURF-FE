import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UpdateActiveGenerationRequest } from './types';

export async function updateActiveGeneration(body: UpdateActiveGenerationRequest): Promise<void> {
  await axiosInstance.put('/v1/admin/active-generation', body);
}
