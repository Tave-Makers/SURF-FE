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

const REFRESH_PATH = '/v1/auth/refresh'; // 추후 로직 수정 예정
const TIMEOUT_MS = 15_000;

function buildCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const allCookies = cookieStore.getAll();
  return allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
}

function mergeCookies(originalCookieHeader: string, setCookies: string[]) {
  const jar = new Map<string, string>();
  if (originalCookieHeader) {
    originalCookieHeader.split(';').forEach((p) => {
      const [k, v] = p.trim().split('=');
      if (k && v) jar.set(k, v);
    });
  }
  setCookies.forEach((sc) => {
    const first = sc.split(';', 1)[0]?.trim();
    if (!first) return;
    const [k, v] = first.split('=');
    if (k && v) jar.set(k, v);
  });
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
      redirect: 'follow',
      headers: cookieHeader0 ? { cookie: cookieHeader0 } : {},
    });

    if (res.ok) {
      const json = (await res.json()) as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    if (res.status === 401) {
      const refreshUrl = `${BACKEND}${REFRESH_PATH}`;
      const refresh = await fetchWithTimeout(refreshUrl, {
        method: 'POST',
        cache: 'no-store',
        headers: cookieHeader0 ? { cookie: cookieHeader0 } : {},
      });

      if (!refresh.ok) redirect('/login');

      const setCookies = getSetCookies(refresh);
      const cookieHeader1 = mergeCookies(cookieHeader0, setCookies);
      const retry = await fetchWithTimeout(validUrl, {
        cache: 'no-store',
        headers: { cookie: cookieHeader1 },
      });

      if (!retry.ok) redirect('/login');
      const json = (await retry.json()) as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    // 403 Forbidden
    console.error(`[Auth] 검증 실패: ${res.status}`);
    redirect('/login');
  } catch (error) {
    // Next.js 리다이렉트 에러는 그대로 던짐
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    console.error('[Auth] 예상치 못한 에러:', error);
    redirect('/login');
  }
});

function handleBusinessRedirect(json: ValidStatusResponse) {
  const user = json.data;
  console.log(`[Auth] 유저 상태: ${user.memberStatus}`);
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
