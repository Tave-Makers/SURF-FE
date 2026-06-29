import { useQuery } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { mapTeamMemberScoresDtoToMembers } from '../mapper';
import { activityScoreQueryKeys } from './queryKeys';

type UseTeamMemberScoresQueryParams = {
  teamId: number;
  enabled?: boolean;
};

export const useTeamMemberScoresQuery = ({
  teamId,
  enabled = true,
}: UseTeamMemberScoresQueryParams) => {
  return useQuery({
    queryKey: activityScoreQueryKeys.teamMemberScores(teamId),
    queryFn: () => activityScoreApi.getTeamMemberScores(teamId),
    select: mapTeamMemberScoresDtoToMembers,
    enabled,
    retry: false,
  });
};
