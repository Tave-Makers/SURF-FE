import { axiosInstance } from '@/shared/lib/axiosInstance';
import { UpdateBannerResponse } from './types';

export async function activateBanner(id: number) {
  const response = await axiosInstance.patch<UpdateBannerResponse>(
    `/v1/admin/home/banners/${id}/activate`,
  );
  return response.data.data;
}
