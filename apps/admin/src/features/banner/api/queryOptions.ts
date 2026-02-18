import { queryOptions } from '@tanstack/react-query';
import { getBannerListClient } from './getBannerListClient';
import { bannerQueryKeys } from './queryKeys';
import { mapBannerItemToBannerUI } from '../model/mapper';

export function bannerListQueryOptions({ fetcher = getBannerListClient } = {}) {
  return queryOptions({
    queryKey: bannerQueryKeys.list(),
    queryFn: async () =>
      (await fetcher())
        .map(mapBannerItemToBannerUI)
        .sort((a, b) => a.displayOrder - b.displayOrder),
  });
}
