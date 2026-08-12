import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type {
  MemberScoreRankingItemDto,
  ScoreRankingPageDto,
} from '@/entities/activity-score/api/types';
import {
  createInfiniteDataSelector,
  getNextPageNumber,
  type InfiniteSelectResult,
  type PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapMemberScoreRankingItemDtoToMember } from '../mapper';
import type { ActivityScoreMember } from '../types';
import { activityScoreQueryKeys } from './queryKeys';

type UseMemberScoreRankingQueryParams = {
  pageSize: number;
  enabled?: boolean;
};

const mapMemberScoreRankingPageDtoToPage = (
  dto: ScoreRankingPageDto<MemberScoreRankingItemDto>,
): PageWithContent<ActivityScoreMember> => ({
  ...dto,
  content: (dto.content ?? []).map(mapMemberScoreRankingItemDtoToMember),
});

export const useMemberScoreRankingQuery = ({
  pageSize,
  enabled = true,
}: UseMemberScoreRankingQueryParams) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isLoadingError,
    isFetchNextPageError,
    refetch,
  } = useInfiniteQuery(
    infiniteQueryOptions<
      PageWithContent<ActivityScoreMember>,
      Error,
      InfiniteSelectResult<ActivityScoreMember>,
      ReturnType<typeof activityScoreQueryKeys.memberRanking>,
      number
    >({
      queryKey: activityScoreQueryKeys.memberRanking(pageSize),
      queryFn: async ({ pageParam }) => {
        const response = await activityScoreApi.getMemberScoreRanking({
          pageNum: pageParam,
          pageSize,
        });

        return mapMemberScoreRankingPageDtoToPage(response);
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageNumber,
      select: createInfiniteDataSelector<ActivityScoreMember>(),
      enabled,
      retry: false,
    }),
  );

  const members = data?.items ?? [];

  return {
    data: members,
    members,
    isLast: data?.isLast ?? true,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isLoadingError,
    isFetchNextPageError,
    refetch,
  };
};
