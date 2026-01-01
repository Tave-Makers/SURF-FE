import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommonResponse } from '@/shared/api/types';

export async function deleteOneRecentSearch(keyword: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete<CommonResponse<null>>(
      `/v1/user/search/recent/${encodeURIComponent(keyword)}`,
    );
    return res.data.code === 200;
  } catch (error) {
    console.error('Failed to delete recent search:', error);
    return false;
  }
}
