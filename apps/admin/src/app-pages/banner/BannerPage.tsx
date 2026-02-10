'use client';

import { HeaderMode } from '@surf/ui/header';
import { reorderArray } from '@surf/utils';
import { useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { BannerDnd } from '@/entities/banner/ui/BannerDnd';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

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
  const handleReorder = (from: number, to: number) => {
    const newArray = reorderArray(banners, from, to);
    setBanners(newArray);
  };
  // const inactive = banners.filter((b) => !b.isActive);
  const [isReorderMode, setIsReorderMode] = useState(false);
  return (
    <>
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '홈 배너 관리',
          text: isReorderMode ? '완료' : '순서 변경',
          btnVariant: isReorderMode ? 'primary' : 'secondary',
          hasLeftIcon: true,
          onClickTextBtn() {
            setIsReorderMode((prev) => !prev);
          },
        }}
      />
      <div className="flex h-full w-full flex-col">
        <BannerDnd
          banners={banners}
          isReorderMode={isReorderMode}
          onReorder={handleReorder}
          onClick={(id) => console.log('click more:', id)}
        />

        {/* {inactive.map((b) => (
          <BannerItem
            key={b.id}
            name={b.name}
            imageUrl={b.imageUrl}
            isActive={b.isActive}
            isReorderMode={isReorderMode}
            onClick={() => console.log('click')}
          />
        ))} */}
      </div>
    </>
  );
};
