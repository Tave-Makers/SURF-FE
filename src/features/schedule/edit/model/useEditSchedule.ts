import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editSchedule } from '../api/editSchedule';
import { EditScheduleRequest } from '../api/types';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';

type UseEditScheduleOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useEditSchedule = (options?: UseEditScheduleOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: EditScheduleRequest }) =>
      editSchedule(scheduleId, data),

    onSuccess: (_, variables) => {
      const { scheduleId } = variables;

      // 1) 일정 단건 invalidate
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.scheduleDetail(scheduleId),
      });

      // 2) 월별 캘린더 invalidate (부분 매칭)
      void queryClient.invalidateQueries({
        queryKey: scheduleQueryKeys.all,
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('일정 수정 요청 성공');
      }
      options?.onSuccess?.();
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 수정 요청 실패:', error);
      }
      options?.onError?.(error);
    },
  });
};
