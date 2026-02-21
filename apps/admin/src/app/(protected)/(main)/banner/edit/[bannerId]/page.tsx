import { redirect, useParams } from 'next/navigation';
import { BannerEditPage } from '@/app-pages/banner/BannerEditPage';
import { PAGE_ROUTES } from '@/shared/config/path';

const Page = () => {
  const params = useParams<{ bannerId: string }>();
  const numericId = Number(params.bannerId);

  if (isNaN(numericId)) {
    redirect(PAGE_ROUTES.BANNER.LIST);
  }

  return <BannerEditPage bannerId={numericId} />;
};

export default Page;
