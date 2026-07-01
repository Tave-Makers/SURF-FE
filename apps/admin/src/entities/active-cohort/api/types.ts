import type { CommonResponse } from '@/shared/api/types';

export interface ActiveGenerationData {
  activeGeneration: number;
}

export type ActiveGenerationResponse = CommonResponse<ActiveGenerationData>;

export interface UpdateActiveGenerationRequest {
  activeGeneration: number;
}
