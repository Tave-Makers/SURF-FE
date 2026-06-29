import { useQuery } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapTeamScoreRankingPageDtoToTeams } from '../mapper';
import type { ScoreGroupKind } from '../types';
import { activityScoreQueryKeys } from './queryKeys';

type UseTeamScoreRankingQueryParams = {
  kind?: ScoreGroupKind;
  generation?: number;
  pageNum: number;
  pageSize: number;
  enabled?: boolean;
};

export const useTeamScoreRankingQuery = ({
  kind,
  generation,
  pageNum,
  pageSize,
  enabled = true,
}: UseTeamScoreRankingQueryParams) => {
  return useQuery({
    queryKey: activityScoreQueryKeys.teamRanking({ kind, generation, pageNum, pageSize }),
    queryFn: () => activityScoreApi.getTeamScoreRanking({ generation, pageNum, pageSize }),
    select: (data) => {
      const teams = mapTeamScoreRankingPageDtoToTeams(data);
      if (!kind) return teams;

      return teams.filter((team) => team.kind === kind);
    },
    enabled,
    retry: false,
  });
};
