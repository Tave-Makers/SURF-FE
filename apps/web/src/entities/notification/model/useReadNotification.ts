import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotification } from '../api/readNotification';
import { notificationKeys } from './queryKeys';
import type { GetNotificationsResponse } from '../api/types';

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => readNotification(id),

    onMutate: async (notificationId) => {
      // 진행 중인 refetch가 있다면 취소
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // 이전 데이터 스냅샷
      const previousNotifications = queryClient.getQueriesData({
        queryKey: notificationKeys.all,
      });

      // 알림 읽음 여부 데이터 직접 수정
      queryClient.setQueriesData(
        { queryKey: notificationKeys.all },
        (oldData: GetNotificationsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true } // 해당 ID 알림 읽음 처리
                : notification,
            ),
          };
        },
      );

      // context 객체로 이전 데이터 반환
      return { previousNotifications };
    },

    // 에러 발생 시 롤백
    onError: (err, notificationId, context) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('알림 읽음 처리 실패:', err);
      }

      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}
