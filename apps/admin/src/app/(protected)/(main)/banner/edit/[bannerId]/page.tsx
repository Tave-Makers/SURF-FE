'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BannerEditPage } from '@/app-pages/banner/BannerEditPage';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = () => {
  const router = useRouter();
  const params = useParams<{ bannerId: string }>();
  const numericId = Number(params.bannerId);
  const isValidId = params.bannerId && !isNaN(numericId);

  useEffect(() => {
    if (!isValidId) {
      router.replace(PAGE_ROUTES.BANNER.LIST);
    }
  }, [isValidId, router]);

  if (!isValidId) return null;

  return <BannerEditPage bannerId={numericId} />;
};

export default Page;
