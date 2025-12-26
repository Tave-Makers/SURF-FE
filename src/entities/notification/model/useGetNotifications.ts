import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/getNotifications';
import { mapTabToCategory } from './mappers';
import { mapNotificationToItem } from './mappers';
import type { NotificationTab } from './notificationTab';
import { notificationKeys } from './queryKeys';

export function useGetNotifications(selectedTab: NotificationTab) {
  const apiCategory = mapTabToCategory(selectedTab);

  return useQuery({
    queryKey: notificationKeys.list(apiCategory),
    queryFn: () => getNotifications(apiCategory),
    select: (response) => {
      return response.notifications.map(mapNotificationToItem);
    },
  });
}
