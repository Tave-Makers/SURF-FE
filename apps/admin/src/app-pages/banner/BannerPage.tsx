'use client';
import { Fab } from '@surf/ui/fab';
import { HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BannerListWidget } from '@/widgets/banner/ui/BannerListWidget';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const BannerPage = () => {
  const router = useRouter();
  const [isReorderMode, setIsReorderMode] = useState(false);
  // 위젯에서 변경된 최신 순서 데이터 상태
  const [tempBanners, setTempBanners] = useState<Banner[]>([]);

  // const handleSaveOrder = async () => {
  const handleSaveOrder = () => {
    // TODO: updateBannerOrder(tempBanners.map(({ id, displayOrder }) => ({ id, displayOrder })))
    console.log(
      '서버에 저장될 최종 순서:',
      tempBanners.map((b) => ({ id: b.id, order: b.displayOrder })),
    );

    setIsReorderMode(false);
  };

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
            if (isReorderMode) {
              handleSaveOrder();
            } else {
              setIsReorderMode(true);
            }
          },
        }}
      />
      <div className="flex h-full w-full flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <BannerListWidget isReorderMode={isReorderMode} onBannersChange={setTempBanners} />
        </Suspense>

        {!isReorderMode && (
          <div className="pointer-events-none fixed inset-0 z-50">
            <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
              <div className="pointer-events-auto absolute right-15 bottom-15">
                <Fab onClick={() => router.push(PAGE_ROUTES.BANNER.CREATE)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
