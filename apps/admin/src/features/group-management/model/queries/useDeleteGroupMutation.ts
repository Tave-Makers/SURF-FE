import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi } from '@/features/group-management/api/groupApi';
import { groupQueryKeys } from '@/features/group-management/model/queries/queryKeys';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';

export const useDeleteGroupMutation = (groupId?: number) => {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);
  const removeForm = useGroupFormStore((s) => s.removeForm);

  return useMutation({
    mutationFn: async () => {
      if (!groupId) throw new Error('INVALID_GROUP_ID');
      await groupApi.deleteGroup({ teamId: groupId });
    },
    onSuccess: () => {
      // remove form
      removeForm(String(groupId));

      // invalidate
      qc.removeQueries({ queryKey: groupQueryKeys.detail(groupId!) });
      void qc.invalidateQueries({ queryKey: groupQueryKeys.lists() });
    },
    onError: (err) => {
      console.error('[Group Delete Error]', err.message);
      showToast(err.message);
    },
  });
};
