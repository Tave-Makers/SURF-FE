import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CreateBannerRequest, CreateBannerResponse } from './types';

export async function createBanner(data: CreateBannerRequest) {
  const response = await axiosInstance.post<CreateBannerResponse>('/v1/admin/home/banners', data);
  return response.data.data;
}
