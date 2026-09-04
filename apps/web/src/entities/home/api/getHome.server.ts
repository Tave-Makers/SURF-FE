import 'server-only';
import type { HomeApiResponseData } from './types';
import { serverFetchCommon } from '@/shared/api/serverFetchCommon';
import { isHomeApiResponseData } from './guards';

export async function getHome(): Promise<HomeApiResponseData> {
  return serverFetchCommon('/v1/user/home', isHomeApiResponseData);
}
