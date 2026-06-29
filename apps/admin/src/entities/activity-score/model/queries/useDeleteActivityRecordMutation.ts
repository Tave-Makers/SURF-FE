import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityScoreApi } from '../../api/activityScoreApi';
import { activityScoreQueryKeys } from './queryKeys';

export const useDeleteActivityRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityRecordId: number) =>
      activityScoreApi.deleteActivityRecord(activityRecordId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.rankings() });
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.activityRecords() });
    },
    onError: (error) => {
      console.error('[useDeleteActivityRecordMutation] 활동기록 삭제 실패:', error);
    },
  });
};
