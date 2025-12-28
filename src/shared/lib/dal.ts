import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ValidStatusResponse } from '@/features/auth/api/types';

const BACKEND = (() => {
  const url = process.env.API_BASE_URL;
  if (!url) throw new Error('API_BASE_URL is not set');
  return url.replace(/\/+$/, '');
})();

const REFRESH_PATH = '/v1/auth/refresh'; // TODO: refresh 로직 변경
const TIMEOUT_MS = 15_000;

function buildCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const parts: string[] = [];
  for (const c of cookieStore.getAll()) {
    parts.push(`${c.name}=${c.value}`);
  }
  return parts.join('; ');
}

function mergeCookies(originalCookieHeader: string, setCookies: string[]) {
  const jar = new Map<string, string>();

  for (const part of originalCookieHeader.split(';')) {
    const p = part.trim();
    if (!p) continue;
    const idx = p.indexOf('=');
    if (idx <= 0) continue;
    jar.set(p.slice(0, idx), p.slice(idx + 1));
  }

  for (const sc of setCookies) {
    const first = sc.split(';', 1)[0]?.trim();
    if (!first) continue;
    const idx = first.indexOf('=');
    if (idx <= 0) continue;
    jar.set(first.slice(0, idx), first.slice(idx + 1));
  }

  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];

  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

export const verifySession = cache(async () => {
  try {
    const cookieStore = await cookies();
    const cookieHeader0 = buildCookieHeader(cookieStore);

    const validUrl = `${BACKEND}/v1/user/members/valid-status`;

    const res = await fetchWithTimeout(validUrl, {
      cache: 'no-store',
      redirect: 'manual',
      headers: cookieHeader0 ? { cookie: cookieHeader0 } : {},
    });

    if (res.status !== 401 && res.ok) {
      const json = (await res.json()) as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    if (res.status === 401) {
      const refreshUrl = `${BACKEND}${REFRESH_PATH}`;

      const refresh = await fetchWithTimeout(refreshUrl, {
        method: 'POST',
        cache: 'no-store',
        redirect: 'manual',
        headers: cookieHeader0 ? { cookie: cookieHeader0 } : {},
      });

      if (!refresh.ok) redirect('/login');

      const setCookies = getSetCookies(refresh);
      const cookieHeader1 = mergeCookies(cookieHeader0, setCookies);

      const retry = await fetchWithTimeout(validUrl, {
        cache: 'no-store',
        redirect: 'manual',
        headers: cookieHeader1 ? { cookie: cookieHeader1 } : {},
      });

      if (!retry.ok) redirect('/login');

      const json = (await retry.json()) as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    // 401이 아닌 실패
    redirect('/login');
  } catch (error) {
    // timeout 또는 network error 처리
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Session verification timeout');
    } else {
      console.error('Session verification failed:', error);
    }
    redirect('/login');
  }
});
function handleBusinessRedirect(json: ValidStatusResponse) {
  const user = json.data;

  switch (user.memberStatus) {
    case 'WAITING':
      return redirect('/login?msg=pending');
    case 'REJECTED':
      return redirect('/login?msg=rejected');
    case 'REGISTERING':
      return redirect('/onboarding?msg=incomplete');
    case 'APPROVED':
      return user;
    default:
      return redirect('/login');
  }
}
