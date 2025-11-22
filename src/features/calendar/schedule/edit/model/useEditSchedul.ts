import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editSchedule } from '../api/editSchedule';

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editSchedule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar-schedule'] }),
    onError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('일정 수정 실패', error);
      }
    },
  });
};
