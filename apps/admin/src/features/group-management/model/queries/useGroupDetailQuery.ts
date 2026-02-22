import { groupApi } from '@/features/group-management/api/groupApi';
import { mapGroupDetailResDtoToGroupFormDraft } from '@/features/group-management/model/mapper';
import { useQuery } from '@tanstack/react-query';
import { GroupManagementMode } from '@/widgets/group-management/model/types';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';

export const useGroupDetailQuery = (mode: GroupManagementMode, groupId?: number) => {
  const enabled = mode !== 'create' && typeof groupId === 'number';

  return useQuery({
    queryKey: enabled ? groupQueryKeys.detail(groupId) : groupQueryKeys.detailDisabled(),
    queryFn: () => groupApi.getGroupDetail({ teamId: groupId! }),
    select: mapGroupDetailResDtoToGroupFormDraft,
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};
