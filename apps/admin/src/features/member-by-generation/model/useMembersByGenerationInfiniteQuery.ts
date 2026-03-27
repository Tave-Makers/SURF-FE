'use client';

import { infiniteQueryOptions, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toMemberBase } from '@/entities/member/model/mapper';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import {
  createInfiniteDataSelector,
  getNextPageNumber,
  type InfiniteSelectResult,
  type PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import { getMemberListByGeneration } from '../api/getMemberListByGeneration';
import type { MemberListParams } from '../api/types';

const MEMBER_BY_GENERATION_PAGE_SIZE = 20;

/**
 * 기수별 멤버 목록 조회 필터
 */
export interface MembersByGenerationFilters {
  generation: number;
  keyword?: string;
}

/**
 * API 요청 파라미터를 생성
 */
function buildMemberListParams(
  generation: number,
  keyword: string,
  pageParam: number,
): MemberListParams {
  return {
    generation,
    pageNum: pageParam,
    pageSize: MEMBER_BY_GENERATION_PAGE_SIZE,
    ...(keyword ? { keyword } : {}),
  };
}

/**
 * 기수별 멤버 무한스크롤 목록 훅
 *
 * 1) 리스트 캐시에는 memberId만 저장
 * 2) 실제 멤버 데이터는 member.base 캐시에 시드
 *
 * 분리를 통해 멤버 단건 변경(상태/역할 등) base 캐시만 갱신해도 리스트 화면에서 갱신된 데이터를 O(1) 반영 가능
 */
export function useMembersByGenerationInfiniteQuery({
  filters,
  enabled,
}: {
  filters: MembersByGenerationFilters;
  enabled?: boolean;
}) {
  // 키워드 정규화
  const normalizedKeyword = filters.keyword?.trim() ?? '';
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading } =
    useInfiniteQuery(
      infiniteQueryOptions<
        PageWithContent<number>,
        Error,
        InfiniteSelectResult<number>,
        ReturnType<typeof memberQueryKeys.generationList>,
        number
      >({
        // generation + normalizedKeyword 조합을 목록 캐시의 식별자로 사용
        queryKey: memberQueryKeys.generationList(filters.generation, normalizedKeyword),

        queryFn: async ({ pageParam = 0 }) => {
          // queryKey와 동일한 조건으로 API 파라미터를 구성
          const params = buildMemberListParams(filters.generation, normalizedKeyword, pageParam);
          const response = await getMemberListByGeneration(params);
          const { content, ...pageMeta } = response;

          // API DTO -> 도메인 MemberBase 변환
          const members = content.map(toMemberBase);

          // 리스트 응답을 받는 즉시 멤버 base 캐시에 시드
          members.forEach((member) => {
            queryClient.setQueryData(memberQueryKeys.base(member.id), member);
          });

          return {
            ...pageMeta,
            // 리스트 캐시에는 멤버 ID 목록 반환
            content: members.map((member) => member.id),
          };
        },

        initialPageParam: 0,
        getNextPageParam: getNextPageNumber,
        select: createInfiniteDataSelector<number>(),
        throwOnError: true,
        enabled,
      }),
    );

  // 컴포넌트에서 null 체크 없이 사용할 수 있도록 안전한 기본값을 제공
  const memberIds = data?.items ?? [];
  const isLast = data?.isLast ?? true;

  return {
    ...filters,
    memberIds,
    isLast,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  };
}
