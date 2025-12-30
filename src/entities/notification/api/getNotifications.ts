import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { GetNotificationsResponse, GetNotificationsRequest } from './types';

export async function getNotifications(category?: GetNotificationsRequest['category']) {
  const res = await axiosInstance.get<GetNotificationsResponse>('/v1/user/notifications', {
    params: { category },
  });
  return res.data;
}
