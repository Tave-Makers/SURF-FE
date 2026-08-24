import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationKeys } from '@/entities/notification/model/queryKeys';
import { sendMessage } from '../api/sendMessage';

const SEND_MESSAGE_ERROR_MESSAGE = '쪽지를 보내지 못했습니다.';

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // 알림 목록 무효화
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    onError: (error) => {
      // 차단 관계(양방향)면 서버가 수신을 거부하므로 실패가 정상 응답일 수 있다.
      console.error('쪽지 전송 실패:', error);
      showToast(SEND_MESSAGE_ERROR_MESSAGE);
    },
  });
};
