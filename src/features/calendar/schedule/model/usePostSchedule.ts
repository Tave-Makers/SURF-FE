import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { useMutation } from '@tanstack/react-query';
import { postSchedule } from '@/features/calendar/schedule/api/postSchedule';

export const usePostSchedule = () => {
  return useMutation<ScheduleCreateResponse, Error, ScheduleCreateRequest>({
    mutationKey: ['schedule', 'create'],
    mutationFn: (data) => postSchedule(data),
  });
};
