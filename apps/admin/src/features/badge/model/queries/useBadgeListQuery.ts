import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { mapBadgeResDtoToBadge } from '../mapper';
import { badgeQueryKeys } from './queryKeys';
import { Badge } from '@/entities/badge/model/types';
import { getBadgeList } from '@/features/badge/api/getBadgeList';
import {
  createInfiniteDataSelector,
  getNextPageNumber,
  InfiniteSelectResult,
  PageWithContent,
} from '@/shared/lib/tanstack-query/infiniteQueryUtils';

const BADGE_LIST_PAGE_SIZE = 20;

export const useBadgeListQuery = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery(
      infiniteQueryOptions<
        PageWithContent<Badge>,
        Error,
        InfiniteSelectResult<Badge>,
        ReturnType<typeof badgeQueryKeys.list>,
        number
      >({
        queryKey: badgeQueryKeys.list(),
        queryFn: async ({ pageParam = 0 }) => {
          const response = await getBadgeList({
            pageNum: pageParam,
            pageSize: BADGE_LIST_PAGE_SIZE,
          });
          const { content, ...pageMeta } = response;

          return {
            ...pageMeta,
            numberOfElements: pageMeta.numberOfElements ?? content.length,
            isLast: pageMeta.isLast ?? !pageMeta.hasNext,
            content: content.map(mapBadgeResDtoToBadge),
          };
        },
        initialPageParam: 0,
        getNextPageParam: getNextPageNumber,
        select: createInfiniteDataSelector<Badge>(),
        refetchOnWindowFocus: false,
      }),
    );

  return {
    badges: data?.items ?? [],
    isLast: data?.isLast ?? true,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  };
};
