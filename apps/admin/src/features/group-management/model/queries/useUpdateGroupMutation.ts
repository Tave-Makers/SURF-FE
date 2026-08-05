import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi } from '@/features/group-management/api/groupApi';
import { GroupResDto } from '@/features/group-management/api/types';
import { mapGroupDraftToReq } from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import {
  GroupFormDraft,
  useGroupFormStore,
} from '@/features/group-management/model/useGroupFormStore';

export const useUpdateGroupMutation = (groupId?: number) => {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  const commit = useGroupFormStore((s) => s.commit);

  return useMutation({
    mutationFn: (draft: GroupFormDraft): Promise<GroupResDto> => {
      if (!groupId) throw new Error('INVALID_GROUP_ID');

      const body = mapGroupDraftToReq(draft);
      return groupApi.updateGroup({ teamId: groupId }, body);
    },
    onSuccess: () => {
      // form commit -> dirty = false
      // 서버 데이터 hydrate 가능 상태가 됨
      commit(String(groupId));

      // invalidate
      void qc.invalidateQueries({ queryKey: groupQueryKeys.lists() });
      void qc.invalidateQueries({ queryKey: groupQueryKeys.detail(groupId!) });
    },
    onError: (err) => {
      console.error('[Group Update Error]', err.message);
      showToast(err.message);
    },
  });
};
