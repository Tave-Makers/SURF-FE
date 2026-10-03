import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ValidStatusResponse } from '@/features/auth/api/types';
import { PAGE_ROUTES } from '@/shared/config/path';

const TIMEOUT_MS = 15_000;
const BACKEND = process.env.API_BASE_URL;

const VALID_PATH = '/v1/user/members/valid-status';

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

function buildBackendUrl(path: string): string {
  if (!BACKEND) {
    throw new Error('API_BASE_URL is not configured');
  }

  const base = BACKEND.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

function buildCookieHeaderFromStore(all: { name: string; value: string }[]) {
  return all.map((c) => `${c.name}=${c.value}`).join('; ');
}

function getCookieValue(cookieHeader: string, targetName: string): string | null {
  for (const part of cookieHeader.split(';')) {
    const p = part.trim();
    if (!p) continue;

    const eq = p.indexOf('=');
    if (eq === -1) continue;

    const name = p.slice(0, eq).trim();
    if (name === targetName) return p.slice(eq + 1);
  }

  return null;
}

function buildAuthHeaders(cookieHeader: string): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Client-Type': 'WEB',
  };

  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }

  const accessToken = getCookieValue(cookieHeader, 'accessToken');
  if (accessToken) {
    headers.authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export const verifySession = cache(async function verifySession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeaderFromStore(cookieStore.getAll());

    const res = await fetchWithTimeout(buildBackendUrl(VALID_PATH), {
      cache: 'no-store',
      headers: buildAuthHeaders(cookieHeader),
    });

    // 최초 검증 성공
    if (res.ok) {
      const raw: unknown = await res.json();
      const json = raw as ValidStatusResponse;
      return handleBusinessRedirect(json);
    }

    // middleware가 페이지 렌더 전에 이미 AT를 갱신했어야 한다(exp까지 확인함).
    // 그런데도 401이면 여기서 refresh를 다시 시도하지 않는다 — RSC는 회전된
    // 쿠키를 브라우저에 못 심어서 RT만 태우고 재사용 감지로 이어질 수 있다.
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
