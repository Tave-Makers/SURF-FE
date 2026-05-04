import { CommonResponse } from '@/shared/api/types';

export interface HomeContentResDto {
  id: number;
  message: string;
  sender: string;
}

export interface UpdateHomeContentRequest {
  message: string;
  sender: string;
}

export type HomeContentResponse = CommonResponse<HomeContentResDto>;
