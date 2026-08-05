import 'server-only';
import { isStringArray } from '@/shared/api/primitives';
import { serverFetchJsonGuarded } from '@/shared/api/serverFetchJsonGuarded';
import type { CommonResponse } from '@/shared/api/types';
import { commonResponseGuard } from '@/shared/api/types';

export async function getRecentSearches(): Promise<string[]> {
  try {
    const res = await serverFetchJsonGuarded<CommonResponse<string[]>>(
      '/v1/user/search/recent',
      commonResponseGuard(isStringArray),
    );

    return res.code === 200 ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch recent searches:', error);
    return [];
  }
}
