import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotification } from '../api/readNotification';
import { notificationKeys } from './queryKeys';

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => readNotification(id),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) => {
      console.error('알림 읽음 처리 실패:', error);
    },
  });
}
