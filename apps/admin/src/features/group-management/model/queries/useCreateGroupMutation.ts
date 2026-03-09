import { groupApi } from '@/features/group-management/api/groupApi';
import { GroupResDto } from '@/features/group-management/api/types';
import { mapGroupDraftToReq } from '@/features/group-management/model/mapper';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import {
  GroupFormDraft,
  useGroupFormStore,
} from '@/features/group-management/model/useGroupFormStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGroupMutation = () => {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  const copyForm = useGroupFormStore((s) => s.copyForm);
  const commit = useGroupFormStore((s) => s.commit);

  return useMutation({
    mutationFn: async (draft: GroupFormDraft): Promise<GroupResDto> => {
      const body = mapGroupDraftToReq(draft);
      return groupApi.createGroup(body);
    },
    onSuccess: (created) => {
      // create → {id} 로 폼 이관
      const fromKey = 'create';
      const toKey = `${created.teamId}`;

      copyForm(fromKey, toKey, { overwrite: false });
      commit(toKey);

      // 캐시 갱신: 리스트 invalidate
      void qc.invalidateQueries({ queryKey: groupQueryKeys.lists() });
    },
    onError: (err) => {
      console.error('[Group Create Error]', err.message);
      showToast(err.message);
    },
  });
};
