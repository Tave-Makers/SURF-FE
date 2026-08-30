import { axiosInstance } from '@/shared/lib/axiosInstance';

export type DeleteDeviceTokenRequest = {
  token: string;
};

/** 등록했던 FCM 토큰 삭제. 멱등 — 이미 없거나 타인 소유면 아무 일도 일어나지 않는다 */
export async function deleteDeviceToken(data: DeleteDeviceTokenRequest) {
  return await axiosInstance.delete('/v1/user/notifications/device-tokens', { data });
}
