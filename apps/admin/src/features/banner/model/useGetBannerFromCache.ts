import { useBannerListQuery } from './useGetBannerList';

export const useBannerFromCache = (bannerId: string | number) => {
  return useBannerListQuery({
    select: (banners) => banners.find((b) => b.id === Number(bannerId)),
  });
};
