import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function patchNotification(notificationId: number) {
  await axiosInstance.patch(`/v1/user/notifications/${notificationId}/read`);
}
