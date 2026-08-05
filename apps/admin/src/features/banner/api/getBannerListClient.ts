import { BannerListResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getBannerListClient() {
  const response = await axiosInstance.get<BannerListResponse>('/v1/admin/home/banners');

  return response.data.data;
}
