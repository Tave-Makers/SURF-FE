import type { UserProfileApiResponse } from '@/entities/user/api/types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';

export async function getMyProfile(): Promise<UserProfileApiResponse> {
  const res = await serverFetchWithCookies('/v1/user/members/profile');

  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);

  const raw: unknown = await res.json();
  return raw as UserProfileApiResponse;
}
