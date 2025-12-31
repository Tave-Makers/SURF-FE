import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delSchedule } from '../api/delSchedule';
import { scheduleQueryKeys } from '@/features/calendar/api/queryKeys';

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['schedule', 'delete', 'calendar'],
    mutationFn: delSchedule,

    onSuccess: () => {
      // 1) 캘린더 목록 (월별 포함)
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.lists(),
      });

      // 2) 일정 단건 캐시들
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.details(),
      });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 삭제 실패', error);
      }
    },
  });
};
