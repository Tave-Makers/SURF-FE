import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from '@/entities/notification/model/queryKeys';
import { sendMessage } from '../api/sendMessage';

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // 알림 목록 무효화
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    onError: (error) => {
      console.error('쪽지 전송 실패:', error);
    },
  });
};
