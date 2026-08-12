import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../../api/teamApi';
import { mapTeamSectionsToTeams, toTeamApiType } from '../mapper';
import type { TeamKind } from '../types';
import { teamQueryKeys } from './teamQueryKeys';

type UseTeamsQueryParams = {
  kind: TeamKind;
  /** 지정 시 해당 기수의 팀만 남긴다. (활동 기수 필터) */
  generation?: number;
  enabled?: boolean;
};

export const useTeamsQuery = ({ kind, generation, enabled = true }: UseTeamsQueryParams) => {
  return useQuery({
    queryKey: teamQueryKeys.list({ kind, generation }),
    queryFn: () => teamApi.getTeams({ type: toTeamApiType(kind), generation }),
    select: (sections) => mapTeamSectionsToTeams(sections, generation),
    enabled,
    retry: false,
  });
};
