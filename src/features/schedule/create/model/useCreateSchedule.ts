import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchedule } from '../api/createSchedule';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleCreateResponse, Error, ScheduleCreateRequest>({
    mutationKey: ['schedule', 'create'],
    mutationFn: (data) => createSchedule(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 생성 요청 실패:', error);
      }
    },
  });
};
