import 'server-only';
import type { UserProfileApiResponse } from '@/entities/user/api/types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';

interface GetProfileParams {
  memberId?: number;
}

export async function getProfile(params: GetProfileParams = {}): Promise<UserProfileApiResponse> {
  const { memberId } = params;
  const query = memberId != null ? `?memberId=${encodeURIComponent(String(memberId))}` : '';
  const res = await serverFetchWithCookies(`/v1/user/members/profile${query}`);

  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);

  const raw: unknown = await res.json();
  return raw as UserProfileApiResponse;
}
