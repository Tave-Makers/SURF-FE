import type { GetNotificationsResponse, GetNotificationsRequest } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const NOTIFICATION_DEFAULT_PAGE = 0;
export const NOTIFICATION_PAGE_SIZE = 20;

export async function getNotifications(
  category?: GetNotificationsRequest['category'],
  page: number = NOTIFICATION_DEFAULT_PAGE,
  size: number = NOTIFICATION_PAGE_SIZE,
) {
  const res = await axiosInstance.get<GetNotificationsResponse>('/v1/user/notifications', {
    params: { category, page, size },
  });
  return res.data;
}
