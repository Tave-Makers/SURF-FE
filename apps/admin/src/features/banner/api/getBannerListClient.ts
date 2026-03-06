import { axiosInstance } from '@/shared/lib/axiosInstance';
import { BannerListResponse } from './types';

export async function getBannerListClient() {
  const response = await axiosInstance.get<BannerListResponse>('/v1/admin/home/banners');

  return response.data.data;
}
