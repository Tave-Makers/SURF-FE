import 'server-only';

import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';
import type { ActivityTypeGroupDto, ActivityTypesResponse } from './types';

const SUCCESS_CODES = new Set([0, 200]);

export const getActivityTypesServer = async (): Promise<ActivityTypeGroupDto[] | null> => {
  try {
    const response =
      await serverFetchWithCookies<ActivityTypesResponse>('/v1/manager/activity-types');

    if (!SUCCESS_CODES.has(response.code) || response.data == null) return null;

    return response.data;
  } catch {
    return null;
  }
};
