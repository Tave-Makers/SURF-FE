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
}

export const BannerListWidget = ({ initialBanners, isReorderMode }: BannerListWidgetProps) => {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
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
