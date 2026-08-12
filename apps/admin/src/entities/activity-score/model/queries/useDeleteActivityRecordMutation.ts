import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import { activityScoreApi } from '../../api/activityScoreApi';
import { activityScoreQueryKeys } from './queryKeys';

type DeleteActivityRecordParams = {
  activityRecordId: number;
  memberId: number;
};

export const useDeleteActivityRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ activityRecordId }: DeleteActivityRecordParams) =>
      activityScoreApi.deleteActivityRecord(activityRecordId),
    onSuccess: (_data, { memberId }) => {
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.rankings() });
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.activityRecords() });
      void queryClient.invalidateQueries({ queryKey: activityScoreQueryKeys.teamMembers() });
      void queryClient.invalidateQueries({ queryKey: memberQueryKeys.detail(memberId) });
    },
    onError: (error) => {
      console.error('[useDeleteActivityRecordMutation] 활동기록 삭제 실패:', error);
    },
  });
};
