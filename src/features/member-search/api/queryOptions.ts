import { infiniteQueryOptions } from '@tanstack/react-query';
import { memberSearchQueryKeys } from './queryKeys';
import { memberSearchApi } from '@/features/member-search/api/memberSearchApi';
import { toMemberSearchRequest, mapMemberSearchItem } from '../model/mapper';
import { MemberSearchFilters } from '@/entities/search/model/types';
import { MemberSearchResponse } from '@/features/member-search/api/types';

const PAGE_SIZE = 10;

export function memberSearchQueryOptions(filters: MemberSearchFilters) {
  return infiniteQueryOptions({
    queryKey: memberSearchQueryKeys.list(filters),

    queryFn: async ({ pageParam = 0 }): Promise<MemberSearchResponse> => {
      try {
        const res = await memberSearchApi.memberSearch(
          toMemberSearchRequest(filters, pageParam, PAGE_SIZE),
        );
        return res.data.data;
      } catch (err) {
        console.error('[memberSearchQueryOptions] API 호출 실패:', err);
        throw err;
      }
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage: MemberSearchResponse) => {
      const { isLast, pageNumber } = lastPage;
      return isLast ? undefined : pageNumber + 1;
    },

    select: (data) => {
      const members = data.pages.flatMap((page) => page.content.map(mapMemberSearchItem));

      return {
        pages: data.pages,
        pageParams: data.pageParams,
        members,
        totalCount: data.pages[0]?.totalCount ?? null,
        isLast: data.pages[data.pages.length - 1]?.isLast ?? true,
      };
    },
  });
}
