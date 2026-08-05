import { UpdateBannerResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deactivateBanner(id: number) {
  const response = await axiosInstance.patch<UpdateBannerResponse>(
    `/v1/admin/home/banners/${id}/deactivate`,
  );
  return response.data.data;
}
