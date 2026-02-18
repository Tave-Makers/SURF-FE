import { Banner } from '@/entities/banner/model/types';
import { BannerFilterType } from '../model/types';

// 활성 배너를 상단에, 비활성 배너를 하단에 배치하는 그룹화 함수
export const getGroupedByStatus = (banners: Banner[]): Banner[] => {
  const active = banners.filter((b) => b.isActive);
  const inactive = banners.filter((b) => !b.isActive);
  return [...active, ...inactive];
};

// 리스트 순서대로 1부터 displayOrder를 다시 할당하는 함수
export const reassignDisplayOrders = (banners: Banner[]): Banner[] => {
  return banners.map((banner, index) => ({
    ...banner,
    displayOrder: index + 1,
  }));
};

// 드래그 앤 드롭으로 변경된 필터링 리스트를 전체 리스트와 병합하는 함수
export const mergeReorderedList = (
  allBanners: Banner[],
  reorderedFiltered: Banner[],
  currentFilter: BannerFilterType,
): Banner[] => {
  if (currentFilter === 'all') return reorderedFiltered;

  const movedIds = new Set(reorderedFiltered.map((b) => b.id));
  const restBanners = allBanners.filter((b) => !movedIds.has(b.id));

  if (currentFilter === 'active') {
    return [...reorderedFiltered, ...restBanners.filter((b) => !b.isActive)];
  }

  // inactive 필터
  return [...restBanners.filter((b) => b.isActive), ...reorderedFiltered];
};
