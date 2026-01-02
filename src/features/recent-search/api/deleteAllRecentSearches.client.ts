import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommonResponse } from '@/shared/api/types';

export async function deleteAllRecentSearches(): Promise<boolean> {
  try {
    const res = await axiosInstance.delete<CommonResponse<null>>('/v1/user/search/recent');
    return res.data.code === 204;
  } catch (error) {
    console.error('Failed to delete all recent searches:', error);
    return false;
  }
}
