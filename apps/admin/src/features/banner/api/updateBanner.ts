import { axiosInstance } from '@/shared/lib/axiosInstance';
import { UpdateBannerRequest, UpdateBannerResponse } from './types';

export async function updateBanner(bannerId: number, data: UpdateBannerRequest) {
  const response = await axiosInstance.put<UpdateBannerResponse>(
    `/v1/admin/home/banners/${bannerId}`,
    data,
  );
  return response.data.data;
}
