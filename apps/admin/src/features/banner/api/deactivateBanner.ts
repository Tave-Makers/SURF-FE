import { axiosInstance } from '@/shared/lib/axiosInstance';
import { UpdateBannerResponse } from './types';

export async function deactivateBanner(id: number) {
  const response = await axiosInstance.patch<UpdateBannerResponse>(
    `/v1/admin/home/banners/${id}/deactivate`,
  );
  return response.data.data;
}
