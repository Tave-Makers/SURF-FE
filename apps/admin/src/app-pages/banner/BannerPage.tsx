'use client';
import { Fab } from '@surf/ui/fab';
import { HeaderMode } from '@surf/ui/header';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { useReorderBannerMutation } from '@/features/banner/model/mutations';
import { useBannerListQuery } from '@/features/banner/model/useGetBannerList';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BannerListWidget } from '@/widgets/banner/ui/BannerListWidget';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const BannerPage = () => {
  const router = useRouter();
  const [isReorderMode, setIsReorderMode] = useState(false);
  // 서버 데이터
  const { data: serverBanners } = useBannerListQuery();
  // 위젯에서 변경된 최신 순서 데이터 상태
  const [tempBanners, setTempBanners] = useState<Banner[]>([]);
  const { mutate: reorderBanners, isPending } = useReorderBannerMutation();
  // 서버 원본 데이터와 로컬 데이터 비교
  const isOrderUnchanged = useMemo(() => {
    if (!isReorderMode || tempBanners.length === 0) return true;
    const serverIds = serverBanners.map((b) => b.id).join(',');
    const tempIds = tempBanners.map((b) => b.id).join(',');

    return serverIds === tempIds;
  }, [serverBanners, tempBanners, isReorderMode]);
  const showToast = useToastStore((s) => s.show);

  const handleBannersChange = useCallback((updatedBanners: Banner[]) => {
    setTempBanners(updatedBanners);
  }, []);

  const handleSaveOrder = () => {
    // 변경사항이 있을 때만 저장 로직 실행
    if (!isOrderUnchanged) {
      const orderedIds = tempBanners.map((b) => b.id);
      reorderBanners(
        { orderedIds },
        {
          onSuccess: () => {
            setTempBanners([]);
            setIsReorderMode(false);
          },
          onError: () => {
            showToast('배너 순서 변경에 실패했습니다. 다시 시도해주세요.');
          },
        },
      );
    }
    setTempBanners([]);
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
          isDisabled: (isReorderMode && isOrderUnchanged) || isPending,
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
          <BannerListWidget isReorderMode={isReorderMode} onBannersChange={handleBannersChange} />
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
