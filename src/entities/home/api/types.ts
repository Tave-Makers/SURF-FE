import { CommonResponse } from '@/shared/api/types';

export interface HomeBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
}

export interface HomeApiResponseData {
  mainText: string;
  banners: HomeBanner[];
  memberName: string;
  memberGeneration: number;
  memberPart: string;
  nextScheduleTitle?: string;
  nextScheduleDate?: string;
  nextScheduleDeepLink?: string;
}

export type HomeApiResponse = CommonResponse<HomeApiResponseData>;
