import { useQuery } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapMemberScoreRankingPageDtoToMembers } from '../mapper';
import { activityScoreQueryKeys } from './queryKeys';

type UseMemberScoreRankingQueryParams = {
  pageNum: number;
  pageSize: number;
  enabled?: boolean;
};

export const useMemberScoreRankingQuery = ({
  pageNum,
  pageSize,
  enabled = true,
}: UseMemberScoreRankingQueryParams) => {
  return useQuery({
    queryKey: activityScoreQueryKeys.memberRanking(pageNum, pageSize),
    queryFn: () => activityScoreApi.getMemberScoreRanking({ pageNum, pageSize }),
    select: mapMemberScoreRankingPageDtoToMembers,
    enabled,
    retry: false,
  });
};
