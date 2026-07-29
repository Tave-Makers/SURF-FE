import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getNotifications,
  NOTIFICATION_DEFAULT_PAGE,
  NOTIFICATION_PAGE_SIZE,
} from '../api/getNotifications';
import type { NotificationSlice } from '../api/types';
import { mapNotificationToItem, mapTabToCategory } from './mappers';
import type { NotificationTab } from './notificationTab';
import { notificationKeys } from './queryKeys';

export function useGetNotifications(selectedTab: NotificationTab) {
  const apiCategory = mapTabToCategory(selectedTab);

  return useInfiniteQuery({
    queryKey: notificationKeys.list(apiCategory),
    queryFn: async ({ pageParam }): Promise<NotificationSlice> => {
      const response = await getNotifications(apiCategory, pageParam, NOTIFICATION_PAGE_SIZE);
      return response.data;
    },
    initialPageParam: NOTIFICATION_DEFAULT_PAGE,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined;
      return NOTIFICATION_DEFAULT_PAGE + allPages.length;
    },
    select: (data) => data.pages.flatMap((page) => page.content.map(mapNotificationToItem)),
  });
}
