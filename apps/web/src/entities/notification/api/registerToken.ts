import { axiosInstance } from '@/shared/lib/axiosInstance';

export type RegisterTokenRequest = {
  token: string;
  platform: 'WEB' | 'IOS' | 'ANDROID';
};

export async function registerDeviceToken(data: RegisterTokenRequest) {
  return await axiosInstance.post('/v1/user/notifications/device-tokens', data);
}
