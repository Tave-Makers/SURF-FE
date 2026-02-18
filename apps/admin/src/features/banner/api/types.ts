import { CommonResponse } from '@/shared/api/types';

export interface BannerItem {
  id: number;
  name: string;
  imageUrl: string;
  linkUrl: string;
  status: boolean;
  displayOrder: number;
}

export type BannerListDTO = BannerItem[];

export type BannerListResponse = CommonResponse<BannerListDTO>;
