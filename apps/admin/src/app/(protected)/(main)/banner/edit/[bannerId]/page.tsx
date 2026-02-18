'use client';

import { useParams } from 'next/navigation';
import { BannerEditPage } from '@/app-pages/banner/BannerEditPage';

const Page = () => {
  const { bannerId } = useParams<{ bannerId: string }>();

  return <BannerEditPage bannerId={bannerId} />;
};

export default Page;
