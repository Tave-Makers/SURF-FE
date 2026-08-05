import { useQuery } from '@tanstack/react-query';
import { getNotifications, NOTIFICATION_DEFAULT_PAGE } from '../api/getNotifications';
import { notificationKeys } from './queryKeys';

const UNREAD_CHECK_SIZE = 50;

// 임시 방식
export function useHasUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unreadCheck(),
    queryFn: async () => {
      const response = await getNotifications(null, NOTIFICATION_DEFAULT_PAGE, UNREAD_CHECK_SIZE);
      return response.data.content.some((notification) => !notification.read);
    },
  });
}
