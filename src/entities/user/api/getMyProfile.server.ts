import { cookies } from 'next/headers';
import type { UserProfileApiResponse } from '@/entities/user/api/types';

export async function getMyProfile(): Promise<UserProfileApiResponse> {
  const cookieStore = await cookies();
  const cookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${process.env.API_BASE_URL}/v1/user/members/profile`, {
    headers: cookie ? { cookie } : {},
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch profile: ${res.status}`);
  }

  return (await res.json()) as UserProfileApiResponse;
}
