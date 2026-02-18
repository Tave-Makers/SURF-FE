'use client';

import { reorderArray } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Banner } from '@/entities/banner/model/types';
import { BannerDnd } from '@/entities/banner/ui/BannerDnd';
import { useBannerListQuery } from '@/features/banner/api/useGetBannerList';
import {
  getGroupedByStatus,
  mergeReorderedList,
  reassignDisplayOrders,
} from '@/features/banner/lib/bannerUtils';
import { BannerFilterType } from '@/features/banner/model/types';
import { BannerFilter } from '@/features/banner/ui/BannerFilter';
import { PAGE_ROUTES } from '@/shared/config/path';

interface BannerListWidgetProps {
  isReorderMode: boolean;
  // 순서가 변경될 때마다 부모에게 최신 리스트 전달
  onBannersChange?: (updatedBanners: Banner[]) => void;
}

export const BannerListWidget = ({ isReorderMode, onBannersChange }: BannerListWidgetProps) => {
  const router = useRouter();
  const { data: serverBanners } = useBannerListQuery();
  const [banners, setBanners] = useState<Banner[]>(serverBanners);
  const [filter, setFilter] = useState<BannerFilterType>('all');

  // 서버 데이터가 업데이트되면 로컬 상태도 동기화 (순서 변경 모드가 아닐 때만)
  useEffect(() => {
    if (!isReorderMode) {
      setBanners(serverBanners);
    }
  }, [serverBanners, isReorderMode]);

  const filteredBanners = useMemo(() => {
    const targetList = isReorderMode ? banners : getGroupedByStatus(banners);
    if (filter === 'all') return targetList;
    return targetList.filter((b) => (filter === 'active' ? b.isActive : !b.isActive));
  }, [banners, filter, isReorderMode]);

  // 순서 변경 모드 진입 시 순서 동기화
  useEffect(() => {
    if (isReorderMode) {
      setBanners((current) => reassignDisplayOrders(getGroupedByStatus(current)));
    }
  }, [isReorderMode]);

  const handleReorder = (from: number, to: number) => {
    const nextFiltered = reorderArray(filteredBanners, from, to);
    const nextAll = mergeReorderedList(banners, nextFiltered, filter);
    const updated = reassignDisplayOrders(nextAll);
    setBanners(updated);
    onBannersChange?.(updated);
  };

  return (
    <div className="flex flex-col">
      {!isReorderMode && <BannerFilter currentFilter={filter} onFilterChange={setFilter} />}
      <BannerDnd
        banners={filteredBanners}
        isReorderMode={isReorderMode}
        onReorder={handleReorder}
        onClick={(id) => router.push(PAGE_ROUTES.BANNER.EDIT(id))}
      />
    </div>
  );
};
