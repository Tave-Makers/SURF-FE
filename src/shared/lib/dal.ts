import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ValidStatusResponse } from '@/features/auth/api/types';

const BACKEND = (() => {
  const url = process.env.API_BASE_URL;
  if (!url) throw new Error('API_BASE_URL is not set');
  return url;
})();

function buildCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const parts: string[] = [];
  for (const c of cookieStore.getAll()) {
    parts.push(`${c.name}=${c.value}`);
  }
  return parts.join('; ');
}

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const cookieHeader = buildCookieHeader(cookieStore);

  const url = `${BACKEND}/v1/user/members/valid-status`;

  const res = await fetch(url, {
    cache: 'no-store',
    redirect: 'manual',
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });

  if (res.status === 401) {
    // refresh-only 케이스 재시도
    const retry = await fetch(url, {
      cache: 'no-store',
      redirect: 'manual',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    if (retry.status === 401 || !retry.ok) redirect('/login');

    const json = (await retry.json()) as ValidStatusResponse;
    return handleBusinessRedirect(json);
  }

  if (!res.ok) redirect('/login');

  const json = (await res.json()) as ValidStatusResponse;
  return handleBusinessRedirect(json);
});

function handleBusinessRedirect(json: ValidStatusResponse) {
  const user = json.data;

  if (user.memberStatus === 'WAITING') redirect('/login?msg=pending');
  if (user.memberStatus === 'REJECTED') redirect('/login?msg=rejected');
  if (user.needOnboarding) redirect('/onboarding?msg=incomplete');

  return user;
}
