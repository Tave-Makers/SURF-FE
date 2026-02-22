import { useBannerListQuery } from './useGetBannerList';

export const useBannerById = (bannerId: number) => {
  return useBannerListQuery({
    select: (banners) => banners.find((b) => b.id === bannerId),
  });
};
