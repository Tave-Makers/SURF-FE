'use client';

import { HeaderMode } from '@surf/ui/header';
import { PostFab } from '@surf/ui/post-fab';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BannerListWidget } from '@/widgets/banner/BannerListWidget';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const BannerPage = () => {
  const MOCK_DATA = [
    { id: 1, name: '배너 1', imageUrl: '', isActive: true, linkUrl: '' },
    { id: 2, name: '배너 2', imageUrl: '', isActive: true, linkUrl: '' },
    { id: 3, name: '배너 3', imageUrl: '', isActive: false, linkUrl: '' },
    { id: 4, name: '배너 4', imageUrl: '', isActive: true, linkUrl: '' },
  ];

  const router = useRouter();
  const [isReorderMode, setIsReorderMode] = useState(false);

  return (
    <>
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: isReorderMode ? '순서 변경' : '홈 배너 관리',
          text: isReorderMode ? '완료' : '순서 변경',
          btnVariant: isReorderMode ? 'primary' : 'secondary',
          hasLeftIcon: true,
          onClickTextBtn() {
            setIsReorderMode((prev) => !prev);
          },
        }}
      />
      <div className="flex h-full w-full flex-col">
        <BannerListWidget initialBanners={MOCK_DATA} isReorderMode={isReorderMode} />

        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
            <div className="pointer-events-auto absolute right-15 bottom-15">
              <PostFab onClick={() => router.push(PAGE_ROUTES.BANNER.CREATE)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
