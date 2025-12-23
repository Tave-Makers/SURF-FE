import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchNotification } from '../api/patchNotification';
import { notificationKeys } from './queryKeys';

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => patchNotification(id),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
    onError: (error) => {
      console.error('알림 읽음 처리 실패:', error);
    },
  });
}
