import { useInfiniteQuery } from '@tanstack/react-query';
import { getActivityHistory } from '../api/getActivityHistory';
import { ScoreMode } from '../model/types';
import { ActivityHistoryResponse } from '../model/types';
import { toActivityHistory } from '../model/adapter';

export const useInfiniteActivityHistory = (scoreType: ScoreMode, pageSize: number) => {
  return useInfiniteQuery({
    queryKey: ['activity-history', scoreType, pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      const res: ActivityHistoryResponse['data'] = await getActivityHistory(
        scoreType,
        pageSize,
        pageParam,
      );

      return {
        ...res,
        content: res.content.map(toActivityHistory),
      };
    },
    getNextPageParam: (lastPage) => (lastPage.isLast ? undefined : lastPage.pageNumber + 1),
    initialPageParam: 0,
    placeholderData: (prev) => prev,
  });
};
