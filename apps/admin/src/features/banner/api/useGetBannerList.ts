import { useSuspenseQuery } from '@tanstack/react-query';
import { bannerListQueryOptions } from './queryOptions';

export function useBannerListQuery() {
  return useSuspenseQuery(bannerListQueryOptions());
}
