import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import 'server-only';
import { BannerListResponse } from './types';

export async function getBannerListServer() {
  const res = await serverFetchWithCookies<BannerListResponse>('/v1/admin/home/banners');

  return res.data;
}
