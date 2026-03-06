import { Banner } from '@/entities/banner/model/types';
import { BannerItem } from '../api/types';

export const mapBannerItemToBannerUI = (dto: BannerItem): Banner => ({
  id: dto.id,
  name: dto.name,
  imageUrl: dto.imageUrl,
  linkUrl: dto.linkUrl,
  isActive: dto.status,
  displayOrder: dto.displayOrder,
});
