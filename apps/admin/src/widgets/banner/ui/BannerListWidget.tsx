'use client';

import { reorderArray } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { BannerDnd } from '@/entities/banner/ui/BannerDnd';
import { BannerFilterType } from '@/features/banner/model/types';
import { BannerFilter } from '@/features/banner/ui/BannerFilter';

interface BannerListWidgetProps {
  initialBanners: Banner[];
  isReorderMode: boolean;
  // 순서가 변경될 때마다 부모에게 최신 리스트 전달
  onBannersChange?: (updatedBanners: Banner[]) => void;
}

export const BannerListWidget = ({
  initialBanners,
  isReorderMode,
  onBannersChange,
}: BannerListWidgetProps) => {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>(() =>
    [...initialBanners].sort((a, b) => a.displayOrder - b.displayOrder),
  );
  const [filter, setFilter] = useState<BannerFilterType>('all');

  const filteredBanners = useMemo(() => {
    if (isReorderMode) {
      if (filter === 'active') return banners.filter((b) => b.isActive);
      if (filter === 'inactive') return banners.filter((b) => !b.isActive);
      return banners;
    }
    const active = banners.filter((b) => b.isActive);
    const inactive = banners.filter((b) => !b.isActive);

    if (filter === 'active') return active;
    if (filter === 'inactive') return inactive;
    return [...active, ...inactive];
  }, [banners, filter, isReorderMode]);

  const handleReorder = (from: number, to: number) => {
    const nextFiltered = reorderArray(filteredBanners, from, to);

    let nextAllBanners: Banner[] = [];

    // 필터 상태에 따라 전체 리스트 재구성
    if (filter === 'all') {
      nextAllBanners = nextFiltered;
    } else {
      const movedIds = new Set(nextFiltered.map((b) => b.id));
      const rest = banners.filter((b) => !movedIds.has(b.id));

      if (filter === 'active') {
        const inactive = rest.filter((b) => !b.isActive);
        nextAllBanners = [...nextFiltered, ...inactive];
      } else {
        const active = rest.filter((b) => b.isActive);
        nextAllBanners = [...active, ...nextFiltered];
      }
    }

    // displayOrder 재할당
    const updatedBanners = nextAllBanners.map((banner, index) => ({
      ...banner,
      displayOrder: index + 1,
    }));

    setBanners(updatedBanners);
    onBannersChange?.(updatedBanners);
  };
  return (
    <div className="flex flex-col">
      {!isReorderMode && <BannerFilter currentFilter={filter} onFilterChange={setFilter} />}
      <BannerDnd
        banners={filteredBanners}
        isReorderMode={isReorderMode}
        onReorder={handleReorder}
        onClick={(id) => router.push(`/banner/edit/${id}`)}
      />
    </div>
  );
};
