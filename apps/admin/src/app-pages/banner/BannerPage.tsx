'use client';
import { ChipToggle } from '@surf/ui/chip-toggle';
import { HeaderMode } from '@surf/ui/header';
import { reorderArray } from '@surf/utils';
import { useMemo, useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { BannerDnd } from '@/entities/banner/ui/BannerDnd';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type Filter = 'all' | 'active' | 'inactive';

export const BannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, name: '배너 1', imageUrl: '', isActive: true, linkUrl: '' },
    { id: 2, name: '배너 2', imageUrl: '', isActive: true, linkUrl: '' },
    { id: 3, name: '배너 3', imageUrl: '', isActive: false, linkUrl: '' },
    { id: 4, name: '배너 4', imageUrl: '', isActive: true, linkUrl: '' },
  ]);

  // const handleReorder = (from: number, to: number) => {
  //   const active = banners.filter((b) => b.isActive);
  //   const inactive = banners.filter((b) => !b.isActive);

  //   const newActive = reorderArray(active, from, to);

  //   setBanners([...newActive, ...inactive]);
  // };

  // const inactive = banners.filter((b) => !b.isActive);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const filteredBanners = useMemo(() => {
    // 순서 변경 모드: 실제 순서 유지
    if (isReorderMode) {
      if (filter === 'active') return banners.filter((b) => b.isActive);
      if (filter === 'inactive') return banners.filter((b) => !b.isActive);
      return banners;
    }

    // 일반 모드: 전체는 활성 위/비활성 아래로 정렬
    if (filter === 'active') return banners.filter((b) => b.isActive);
    if (filter === 'inactive') return banners.filter((b) => !b.isActive);

    const active = banners.filter((b) => b.isActive);
    const inactive = banners.filter((b) => !b.isActive);
    return [...active, ...inactive];
  }, [banners, filter, isReorderMode]);

  const handleReorder = (from: number, to: number) => {
    const nextFiltered = reorderArray(filteredBanners, from, to);

    if (filter === 'all') {
      setBanners(nextFiltered);
      return;
    }

    const movedIds = new Set(nextFiltered.map((b) => b.id));
    const rest = banners.filter((b) => !movedIds.has(b.id));

    if (filter === 'active') {
      const inactive = rest.filter((b) => !b.isActive);
      setBanners([...nextFiltered, ...inactive]);
      return;
    }

    const active = rest.filter((b) => b.isActive);
    setBanners([...active, ...nextFiltered]);
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
            setIsReorderMode((prev) => !prev);
          },
        }}
      />
      <div className="flex h-full w-full flex-col">
        {!isReorderMode && (
          <div className="border-border-normal flex gap-10 border-b-[0.4px] px-13 pb-10">
            <ChipToggle
              mode="text"
              highlightType="toggle"
              isClicked={filter === 'all'}
              activeColor="blue"
              onToggleIcon={() => setFilter('all')}
            >
              전체
            </ChipToggle>

            <ChipToggle
              mode="text"
              highlightType="toggle"
              isClicked={filter === 'active'}
              activeColor="blue"
              onToggleIcon={() => setFilter('active')}
            >
              활성화
            </ChipToggle>

            <ChipToggle
              mode="text"
              highlightType="toggle"
              isClicked={filter === 'inactive'}
              activeColor="blue"
              onToggleIcon={() => setFilter('inactive')}
            >
              비활성화
            </ChipToggle>
          </div>
        )}
        <BannerDnd
          banners={filteredBanners}
          isReorderMode={isReorderMode}
          onReorder={handleReorder}
          onClick={(id) => console.log('click more:', id)}
        />
      </div>
    </>
  );
};
