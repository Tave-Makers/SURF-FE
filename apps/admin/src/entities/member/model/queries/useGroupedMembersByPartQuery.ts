import { useQuery } from '@tanstack/react-query';
import { getGroupedMembersByPart } from '../../api/getGroupedMembersByPart';
import { toPartMemberGroup } from '../mapper';
import { memberQueryKeys } from './memberQueryKeys';

type UseGroupedMembersByPartQueryParams = {
  generation?: number;
  enabled?: boolean;
};

/** 활동 기수 기준 파트별 회원 그룹 — 점수 부여 대상 선택에서 사용 */
export function useGroupedMembersByPartQuery({
  generation,
  enabled = true,
}: UseGroupedMembersByPartQueryParams) {
  return useQuery({
    queryKey: memberQueryKeys.groupedByPart(generation ?? 0),
    queryFn: () => getGroupedMembersByPart(generation as number),
    select: (groups) => groups.map(toPartMemberGroup),
    enabled: enabled && generation != null,
    retry: false,
  });
}
