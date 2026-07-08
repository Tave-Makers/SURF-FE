import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ValidStatusResponse } from '@/features/auth/api/types';
import { PAGE_ROUTES } from '@/shared/config/path';
import { getAppOrigin } from '@/shared/lib/appOrigin';

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
  return getAppOrigin();
}

function buildCookieHeaderFromStore(all: { name: string; value: string }[]) {
  return all.map((c) => `${c.name}=${c.value}`).join('; ');
}

function mergeCookieHeaderWithSetCookie(origHeader: string, setCookies: string[]) {
  if (!setCookies.length) return origHeader;

  const jar = new Map<string, string>();

  // 기존 Cookie 헤더 파싱
  for (const part of origHeader.split(';')) {
    const p = part.trim();
    if (!p) continue;
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const name = p.slice(0, eq).trim();
    const value = p.slice(eq + 1);
    jar.set(name, value);
  }

  // Set-Cookie로 받은 쿠키로 덮어쓰기
  for (const sc of setCookies) {
    const first = sc.split(';')[0]?.trim();
    if (!first) continue;
    const eq = first.indexOf('=');
    if (eq === -1) continue;
    const name = first.slice(0, eq).trim();
    const value = first.slice(eq + 1);
    jar.set(name, value);
  }

  // Cookie 헤더로 직렬화
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function getSetCookieHeaders(res: Response): string[] {
  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] | undefined };
  if (typeof anyHeaders.getSetCookie === 'function') return anyHeaders.getSetCookie() ?? [];

  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

export const verifySession = cache(async function verifySession() {
  try {
    const baseUrl = await getBaseUrl();

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeaderFromStore(cookieStore.getAll());

    const res = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    // 최초 검증 성공
    if (res.ok) {
      const raw: unknown = await res.json();
      const json = raw as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    // 401이면 refresh -> retry
    if (res.status === 401) {
      const refresh = await fetchWithTimeout(`${baseUrl}${REFRESH_PATH}`, {
        method: 'POST',
        cache: 'no-store',
        headers: cookieHeader ? { cookie: cookieHeader } : {},
      });

      if (!refresh.ok) redirect(PAGE_ROUTES.LOGIN);

      const setCookies = getSetCookieHeaders(refresh);
      const newCookieHeader = mergeCookieHeaderWithSetCookie(cookieHeader, setCookies);

      const retry = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
        cache: 'no-store',
        headers: newCookieHeader ? { cookie: newCookieHeader } : {},
      });

      if (!retry.ok) redirect(PAGE_ROUTES.LOGIN);

      const raw: unknown = await retry.json();
      const json = raw as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    console.error(`[Auth] 검증 실패: ${res.status}`);
    redirect(PAGE_ROUTES.LOGIN);
  } catch (error: unknown) {
    if (isNextRedirectError(error)) throw error;

    console.error('[Auth] 예상치 못한 에러:', safeErrorMessage(error));
    redirect(PAGE_ROUTES.LOGIN);
  }
});

function handleBusinessRedirect(json: ValidStatusResponse) {
  const user = json.data;

  switch (user.memberStatus) {
    case 'WAITING':
      return redirect(PAGE_ROUTES.REDIRECT.MSG_PENDING);
    case 'REJECTED':
      return redirect(PAGE_ROUTES.REDIRECT.MSG_REJECTED);
    case 'REGISTERING':
      return redirect(PAGE_ROUTES.REDIRECT.MSG_INCOMPLETE);
    case 'APPROVED':
      return user;
    default:
      return redirect(PAGE_ROUTES.LOGIN);
  }
}
