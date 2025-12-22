import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/getNotifications';
import { mapTabToCategory } from './mappers';
import { mapNotificationToItem } from './mappers';
import type { NotificationTab } from './tab';
import { NOTIFICATION_KEYS } from '../api/queryKeys';

export function useGetNotifications(selectedTab: NotificationTab) {
  const apiCategory = mapTabToCategory(selectedTab);

  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(selectedTab),
    queryFn: () => getNotifications(apiCategory),
    select: (response) => {
      return response.notifications.map(mapNotificationToItem);
    },
  });
}
