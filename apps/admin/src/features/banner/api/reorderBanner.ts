import { ReorderBannerRequest, ReorderBannerResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function reorderBanner(data: ReorderBannerRequest) {
  const response = await axiosInstance.put<ReorderBannerResponse>(
    `/v1/admin/home/banners/reorder`,
    data,
  );
  return response.data.data;
}
