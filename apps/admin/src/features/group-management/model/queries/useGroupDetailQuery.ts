import { useQuery } from '@tanstack/react-query';
import { groupApi } from '@/features/group-management/api/groupApi';
import { mapGroupDetailResDtoToGroupFormDraft } from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';

export const useGroupDetailQuery = (groupId?: number) => {
  const enabled = !!groupId;

  return useQuery({
    queryKey: enabled ? groupQueryKeys.detail(groupId) : groupQueryKeys.detailDisabled(),
    queryFn: () => groupApi.getGroupDetail({ teamId: groupId! }),
    select: mapGroupDetailResDtoToGroupFormDraft,
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};
