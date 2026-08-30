import { useQuery } from '@tanstack/react-query';
import { getUnreadNotification } from '../api/getUnreadNotification';
import { notificationKeys } from './queryKeys';

export function useHasUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unreadCheck(),
    queryFn: async () => {
      const response = await getUnreadNotification();
      return response.data.hasUnread;
    },
  });
}
