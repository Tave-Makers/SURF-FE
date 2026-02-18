'use client';

import { useParams, useRouter } from 'next/navigation';
import { BannerEditPage } from '@/app-pages/banner/BannerEditPage';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = () => {
  const router = useRouter();
  const params = useParams<{ bannerId: string }>();
  const numericId = Number(params.bannerId);

  if (isNaN(numericId)) {
    router.replace(PAGE_ROUTES.BANNER.LIST);
    return null;
  }

  return <BannerEditPage bannerId={numericId} />;
};

export default Page;
