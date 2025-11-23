import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editSchedule } from '../api/editSchedule';
import { EditScheduleRequest } from '../api/types';

type UseEditScheduleOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const useEditSchedule = (options?: UseEditScheduleOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: number; data: EditScheduleRequest }) =>
      editSchedule(scheduleId, data),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['calendar-schedule'] });
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
