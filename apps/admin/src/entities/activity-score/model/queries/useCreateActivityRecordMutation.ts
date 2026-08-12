import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateActivityRecordRequest } from '../../api/types';
import { activityScoreApi } from '../../api/activityScoreApi';
import { activityScoreQueryKeys } from './queryKeys';

export const useCreateActivityRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateActivityRecordRequest) => activityScoreApi.createActivityRecord(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.rankings() });
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.activityRecords() });
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.teamMembers() });
    },
    onError: (error) => {
      console.error('[useCreateActivityRecordMutation] 활동 점수 부여 실패:', error);
    },
  });
};
