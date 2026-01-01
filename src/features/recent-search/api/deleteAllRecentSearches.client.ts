import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommonResponse } from '@/shared/api/types';

export async function deleteOneRecentSearch(keyword: string): Promise<boolean> {
  try {
    await axiosInstance.delete<CommonResponse<null>>(
      `/v1/user/search/recent/${encodeURIComponent(keyword)}`,
    );
    return true;
  } catch (error) {
    console.error('Failed to delete recent search:', error);
    return false;
  }
}
