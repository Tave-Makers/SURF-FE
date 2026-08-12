import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import type { ActivityRecordPageDto } from '@/entities/activity-score/api/types';
import {
  createInfiniteDataSelector,
  getNextPageNumber,
  type InfiniteSelectResult,
  type PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapActivityRecordDtoToHistory } from '../mapper';
import type { ScoreHistory } from '../types';
import { activityScoreQueryKeys } from './queryKeys';

type UseMemberActivityRecordsQueryParams = {
  memberId: number;
  scoreType: 'REWARD' | 'PENALTY';
  pageSize: number;
  enabled?: boolean;
};

const mapActivityRecordPageDtoToPage = (
  dto: ActivityRecordPageDto,
): PageWithContent<ScoreHistory> => ({
  ...dto,
  content: (dto.content ?? []).map(mapActivityRecordDtoToHistory),
});

export const useMemberActivityRecordsQuery = ({
  memberId,
  scoreType,
  pageSize,
  enabled = true,
}: UseMemberActivityRecordsQueryParams) => {
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
      PageWithContent<ScoreHistory>,
      Error,
      InfiniteSelectResult<ScoreHistory>,
      ReturnType<typeof activityScoreQueryKeys.memberActivityRecords>,
      number
    >({
      queryKey: activityScoreQueryKeys.memberActivityRecords({
        memberId,
        scoreType,
        pageSize,
      }),
      queryFn: async ({ pageParam }) => {
        const response = await activityScoreApi.getMemberActivityRecords(memberId, {
          scoreType,
          pageNum: pageParam,
          pageSize,
        });

        return mapActivityRecordPageDtoToPage(response);
      },
      initialPageParam: 0,
      getNextPageParam: getNextPageNumber,
      select: createInfiniteDataSelector<ScoreHistory>(),
      enabled,
      retry: false,
    }),
  );

  const histories = data?.items ?? [];

  return {
    data: histories,
    histories,
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
