import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ValidStatusResponse } from '@/features/auth/api/types';

const TIMEOUT_MS = 15_000;

const VALID_PATH = '/api/proxy/v1/user/members/valid-status';
const REFRESH_PATH = '/api/proxy/auth/refresh';

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

function isNextRedirectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  if (!('digest' in error)) return false;

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
}

function safeErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

export const verifySession = cache(async () => {
  try {
    const baseUrl = await getBaseUrl();

    const cookieHeader = (await cookies())
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const res = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    if (res.ok) {
      const raw: unknown = await res.json();
      const json = raw as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    if (res.status === 401) {
      const refresh = await fetchWithTimeout(`${baseUrl}${REFRESH_PATH}`, {
        method: 'POST',
        cache: 'no-store',
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      });

      if (!refresh.ok) redirect('/login');

      const retry = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
        cache: 'no-store',
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      });

      if (!retry.ok) redirect('/login');

      const raw: unknown = await retry.json();
      const json = raw as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    console.error(`[Auth] 검증 실패: ${res.status}`);
    redirect('/login');
  } catch (error: unknown) {
    if (isNextRedirectError(error)) throw error;

    console.error('[Auth] 예상치 못한 에러:', safeErrorMessage(error));
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
