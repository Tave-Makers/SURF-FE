import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postSchedule } from '../api/postSchedule';

export const usePostSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<ScheduleCreateResponse, Error, ScheduleCreateRequest>({
    mutationKey: ['schedule', 'create'],
    mutationFn: (data) => postSchedule(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['calendar-schedule'],
      });
    },

    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 생성 요청 실패:', error);
      }
    },
  });
};
