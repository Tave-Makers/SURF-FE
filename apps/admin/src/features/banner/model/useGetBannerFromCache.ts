import { useBannerListQuery } from './useGetBannerList';

export const useBannerFromCache = (bannerId: number) => {
  return useBannerListQuery({
    select: (banners) => banners.find((b) => b.id === bannerId),
  });
};
