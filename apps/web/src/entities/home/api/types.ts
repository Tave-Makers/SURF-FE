import type { CommonResponse } from '@/shared/api/types';

export interface HomeBanner {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
}

export interface HomeApiResponseData {
  message?: string;
  sender?: string | null;
  banners: HomeBanner[];
  memberName: string;
  memberGeneration: number;
  memberPart: string;
  nextScheduleTitle?: string;
  nextScheduleDate?: string;
  nextScheduleDeepLink?: string;
}

export type HomeApiResponse = CommonResponse<HomeApiResponseData>;
