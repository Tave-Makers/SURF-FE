import type { HomeApiResponse, HomeApiResponseData } from './types';
import { serverFetchJsonGuarded } from '@/shared/api/serverFetchJsonGuarded';
import { homeResponseGuard } from './guards';

export async function getHome(): Promise<HomeApiResponseData> {
  const res = await serverFetchJsonGuarded<HomeApiResponse>('/v1/user/home', homeResponseGuard);

  if (res.code !== 200) {
    throw new Error(`Home API returned error code: ${res.code} (${res.message})`);
  }

  return res.data;
}
