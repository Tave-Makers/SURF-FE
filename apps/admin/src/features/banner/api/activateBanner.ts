import { UpdateBannerResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function activateBanner(id: number) {
  const response = await axiosInstance.patch<UpdateBannerResponse>(
    `/v1/admin/home/banners/${id}/activate`,
  );
  return response.data.data;
}
