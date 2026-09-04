import 'server-only';
import { serverFetchCommon } from '@/shared/api/serverFetchCommon';
import { isStringArray } from '@/shared/api/primitives';

export async function getRecentSearches(): Promise<string[]> {
  try {
    return await serverFetchCommon('/v1/user/search/recent', isStringArray);
  } catch (error) {
    console.error('Failed to fetch recent searches:', error);
    return [];
  }
}
