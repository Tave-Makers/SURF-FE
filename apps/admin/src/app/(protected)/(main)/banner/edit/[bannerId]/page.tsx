'use client';

import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { BannerEditPage } from '@/app-pages/banner/BannerEditPage';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = () => {
  const router = useRouter();
  const params = useParams<{ bannerId: string }>();
  const numericId = Number(params.bannerId);
  const isValidId = Boolean(params.bannerId) && !isNaN(numericId) && numericId > 0;

  useEffect(() => {
    if (!isValidId) {
      router.replace(PAGE_ROUTES.BANNER.LIST);
    }
  }, [isValidId, router]);

  if (!isValidId) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BannerEditPage bannerId={numericId} />;
    </Suspense>
  );
};

export default Page;
