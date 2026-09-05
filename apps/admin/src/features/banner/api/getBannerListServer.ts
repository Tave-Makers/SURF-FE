import 'server-only';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import { BannerListResponse } from './types';

export async function getBannerListServer() {
  const res = await serverFetchWithCookies<BannerListResponse>('/v1/admin/home/banners');

  return res.data;
}
