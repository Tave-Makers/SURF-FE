import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostSchedule } from '../api/delPostSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

interface DeletePostScheduleParams {
  postId: number;
  scheduleId: number;
}

export const useDeletePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, scheduleId }: DeletePostScheduleParams) =>
      deletePostSchedule(postId, scheduleId),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('게시글과 매핑된 일정 삭제 실패', error);
      }
    },
  });
};
