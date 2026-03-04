import { MemberSearchFilters } from '@/entities/search/model/types';

export const memberSearchQueryKeys = {
  all: ['member-search'] as const,

  lists: () => [...memberSearchQueryKeys.all, 'list'] as const,

  list: (filters: MemberSearchFilters) => [...memberSearchQueryKeys.lists(), filters] as const,

  // 기수 목록
  generations: () => [...memberSearchQueryKeys.all, 'generations'] as const,
};
