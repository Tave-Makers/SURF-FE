import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deleteBanner(bannerId: number) {
  const response = await axiosInstance.delete<CommonResponse<object>>(
    `/v1/admin/home/banners/${bannerId}`,
  );
  return response.data.data;
}
