import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { memberSearchQueryKeys } from './queryKeys';
import { memberSearchApi } from '@/features/member-search/api/memberSearchApi';
import { toMemberSearchRequest, mapMemberSearchItem, toGenerationList } from '../mapper';
import { MemberSearchFilters } from '@/entities/search/model/types';
import { MemberSearchResponse } from '@/features/member-search/api/types';

const PAGE_SIZE = 10;

export function memberSearchQueryOptions(filters: MemberSearchFilters) {
  return infiniteQueryOptions({
    queryKey: memberSearchQueryKeys.list(filters),

    queryFn: async ({ pageParam = 0 }): Promise<MemberSearchResponse> => {
      const res = await memberSearchApi.memberSearch(
        toMemberSearchRequest(filters, pageParam, PAGE_SIZE),
      );
      return res;
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

/**
 * 기수 목록 조회 Query 옵션
 *
 * queryFn에서 DTO -> 도메인 모델 매핑을 수행해 캐시에 저장합니다.
 */
export function generationListQueryOptions() {
  return queryOptions({
    queryKey: memberSearchQueryKeys.generations(),
    queryFn: async () => {
      const dto = await memberSearchApi.getGenerationList();
      return toGenerationList(dto);
    },
  });
}
