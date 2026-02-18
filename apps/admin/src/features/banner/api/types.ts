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

export interface UpdateBannerRequest {
  name: string;
  imageUrl: string;
  linkUrl: string;
}

export type UpdateBannerDTO = BannerItem;

export type UpdateBannerResponse = CommonResponse<UpdateBannerDTO>;
