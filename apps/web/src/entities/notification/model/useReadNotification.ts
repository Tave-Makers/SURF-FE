import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { readNotification } from '../api/readNotification';
import { notificationKeys } from './queryKeys';
import type { NotificationSlice } from '../api/types';

export function useReadNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => readNotification(id),

    onMutate: async (notificationId) => {
      // 진행 중인 refetch가 있다면 취소
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      // 이전 데이터 스냅샷
      const previousNotifications = queryClient.getQueriesData({
        queryKey: notificationKeys.lists(),
      });

      // 알림 읽음 여부 데이터 직접 수정 (무한스크롤 캐시: pages[].content[])
      // unreadCheck는 슬라이스가 아니라 boolean이라 여기 섞이면 안 된다 — lists()로 한정한다
      queryClient.setQueriesData(
        { queryKey: notificationKeys.lists() },
        (oldData: InfiniteData<NotificationSlice, number> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, read: true } // 해당 ID 알림 읽음 처리
                  : notification,
              ),
            })),
          };
        },
      );

      // context 객체로 이전 데이터 반환
      return { previousNotifications };
    },

    // 마지막 안 읽은 알림을 읽었을 수 있으므로 홈 뱃지를 다시 확인한다
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCheck() });
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
