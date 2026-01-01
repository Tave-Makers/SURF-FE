import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { CommonResponse } from '@/shared/api/types';

export async function deleteAllRecentSearches() {
  await axiosInstance.delete<CommonResponse<null>>('/v1/user/search/recent');
}
