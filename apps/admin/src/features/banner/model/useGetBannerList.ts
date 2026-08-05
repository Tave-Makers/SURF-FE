import { useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import { bannerListQueryOptions } from '../api/queryOptions';
import { Banner } from '@/entities/banner/model/types';

type BannerListQueryKey = ReturnType<typeof bannerListQueryOptions>['queryKey'];

type Options<TData> = Omit<
  UseSuspenseQueryOptions<Banner[], Error, TData, BannerListQueryKey>,
  'queryKey' | 'queryFn'
>;

export const useBannerListQuery = <TData = Banner[]>(options?: Options<TData>) => {
  const queryOptions = bannerListQueryOptions();

  return useSuspenseQuery({
    ...queryOptions,
    ...options,
  } as UseSuspenseQueryOptions<Banner[], Error, TData, BannerListQueryKey>);
};
