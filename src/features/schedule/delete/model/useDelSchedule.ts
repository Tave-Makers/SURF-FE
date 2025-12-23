import { useMutation, useQueryClient } from '@tanstack/react-query';
import { delSchedule } from '../api/delSchedule';
import { scheduleQueryKeys } from '@/entities/schedule/api/queryKeys';

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: delSchedule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 삭제 실패', error);
      }
    },
  });
};
