import { axiosInstance } from '@/shared/lib/axiosInstance';

export type RegisterTokenRequest = {
  token: string;
  platform: 'WEB'; // 추후 iOS, ANDROID 등 추가 예정
};

export async function registerDeviceToken(data: RegisterTokenRequest) {
  return await axiosInstance.post('/v1/user/notifications/device-tokens', data);
}
