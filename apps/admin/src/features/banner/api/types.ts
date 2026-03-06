import { CommonResponse } from '@/shared/api/types';

export interface BannerBase {
  name: string;
  imageUrl: string;
  linkUrl: string;
}

export interface BannerItem extends BannerBase {
  id: number;
  status: boolean;
  displayOrder: number;
}

export type BannerListDTO = BannerItem[];
export type BannerListResponse = CommonResponse<BannerListDTO>;

export type UpdateBannerRequest = BannerBase;
export type UpdateBannerDTO = BannerItem;
export type UpdateBannerResponse = CommonResponse<UpdateBannerDTO>;

export type CreateBannerRequest = BannerBase;
export type CreateBannerDTO = BannerItem;
export type CreateBannerResponse = CommonResponse<CreateBannerDTO>;

export type ReorderBannerRequest = {
  orderedIds: number[];
};
export type ReorderBannerDTO = BannerItem[];
export type ReorderBannerResponse = CommonResponse<ReorderBannerDTO>;
