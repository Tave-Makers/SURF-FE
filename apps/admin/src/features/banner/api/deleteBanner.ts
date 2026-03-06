import { axiosInstance } from '@/shared/lib/axiosInstance';
import { CommonResponse } from '@/shared/api/types';

export async function deleteBanner(bannerId: number) {
  const response = await axiosInstance.delete<CommonResponse<object>>(
    `/v1/admin/home/banners/${bannerId}`,
  );
  return response.data.data;
}
