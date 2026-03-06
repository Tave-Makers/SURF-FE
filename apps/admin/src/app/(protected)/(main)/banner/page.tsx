import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { BannerPage } from '@/app-pages/banner/BannerPage';
import { getBannerListServer } from '@/features/banner/api/getBannerListServer';
import { bannerListQueryOptions } from '@/features/banner/api/queryOptions';
import { getQueryClient } from '@/shared/lib/tanstack-query/queryClient';

const Page = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(bannerListQueryOptions({ fetcher: getBannerListServer }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BannerPage />
    </HydrationBoundary>
  );
};

export default Page;
