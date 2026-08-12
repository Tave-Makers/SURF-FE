import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../../api/teamApi';
import { mapTeamDetailDtoToMembers } from '../mapper';
import { teamQueryKeys } from './teamQueryKeys';

type UseTeamDetailQueryParams = {
  teamId: number;
  enabled?: boolean;
};

/** 팀원 목록(프로필/트랙 포함) — 점수 부여 대상 선택에서 사용 */
export const useTeamDetailQuery = ({ teamId, enabled = true }: UseTeamDetailQueryParams) => {
  return useQuery({
    queryKey: teamQueryKeys.detail(teamId),
    queryFn: () => teamApi.getTeamDetail(teamId),
    select: mapTeamDetailDtoToMembers,
    enabled,
    retry: false,
  });
};
