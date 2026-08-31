import 'server-only';

import type { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

type ParsedCookie = {
  name: string;
  value: string;
  httpOnly?: boolean;
  maxAge?: number;
  expires?: Date;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function extractAccessToken(v: unknown): string | null {
  if (!isRecord(v)) return null;

  const data = v['data'];
  if (isRecord(data)) {
    const at = data['accessToken'];
    if (typeof at === 'string' && at.length > 0) return at;
  }

  const at2 = v['accessToken'];
  if (typeof at2 === 'string' && at2.length > 0) return at2;

  return null;
}

function parseSetCookie(cookie: string): ParsedCookie | null {
  const [first, ...attributes] = cookie.split(';');
  const eqIdx = first.indexOf('=');
  if (eqIdx <= 0) return null;

  const parsed: ParsedCookie = {
    name: first.slice(0, eqIdx).trim(),
    value: first.slice(eqIdx + 1),
  };

  for (const attr of attributes) {
    const [rawKey, ...rawValueParts] = attr.trim().split('=');
    const key = rawKey.toLowerCase();
    const value = rawValueParts.join('=');

    if (key === 'httponly') parsed.httpOnly = true;
    if (key === 'max-age') {
      const maxAge = Number(value);
      if (Number.isFinite(maxAge)) parsed.maxAge = maxAge;
    }
    if (key === 'expires') {
      const expires = new Date(value);
      if (!Number.isNaN(expires.getTime())) parsed.expires = expires;
    }
    if (key === 'samesite') {
      const sameSite = value.toLowerCase();
      if (sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none') {
        parsed.sameSite = sameSite;
      }
    }
    if (key === 'path') parsed.path = value;
  }

  return parsed;
}

/**
 * 브라우저에게 "이 쿠키를 버려라"고 지시하는 Set-Cookie 인지 판별한다.
 * 백엔드마다 빈 값 / Max-Age=0 / 과거 Expires 중 무엇을 쓸지 다르므로 셋 다 본다.
 */
function isCookieDeletion(cookie: ParsedCookie): boolean {
  if (cookie.value === '') return true;
  if (cookie.maxAge !== undefined && cookie.maxAge <= 0) return true;
  if (cookie.expires !== undefined && cookie.expires.getTime() <= Date.now()) return true;

  return false;
}

function toProxyCookiePath(name: string, path?: string): string {
  if (name === 'oauth_state') return '/api/auth';
  if (!path || path === '/') return path ?? '/';
  if (path.startsWith('/api/proxy')) return path;
  return `/api/proxy${path}`;
}

export function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

/** @returns 백엔드가 세션을 끝냈으면(RT 삭제) true. 호출부는 새 AT 를 심으면 안 된다. */
export function applyUpstreamSetCookies(res: NextResponse, setCookies: string[]): boolean {
  let sessionCleared = false;

  for (const c of setCookies) {
    const parsed = parseSetCookie(c);
    if (!parsed) continue;

    if (parsed.name === 'refreshToken' && isCookieDeletion(parsed)) sessionCleared = true;

    res.cookies.set({
      ...parsed,
      secure: !IS_DEV,
      sameSite: parsed.sameSite === 'none' ? 'lax' : parsed.sameSite,
      path: toProxyCookiePath(parsed.name, parsed.path),
    });
  }

  // accessToken 은 백엔드가 존재를 모르는 웹 자체 쿠키라 삭제 Set-Cookie 가 절대 오지 않는다.
  // RT 를 지웠다는 건 세션이 끝났다는 뜻(로그아웃·탈퇴)이므로 여기서 같이 지운다.
  // 안 지우면 middleware 가 살아있는 AT 만 보고 통과시켜 최대 30분간 자동 로그인된다.
  if (sessionCleared) clearAccessTokenCookie(res);

  return sessionCleared;
}

export function applyAccessTokenCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: 'accessToken',
    value: token,
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 30,
  });
}

/** applyAccessTokenCookie 가 심은 쿠키와 name/path 가 정확히 같아야 삭제된다. */
export function clearAccessTokenCookie(res: NextResponse): void {
  res.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * APP 로그인 흐름은 refreshToken 을 Set-Cookie 가 아니라 응답 본문으로 준다.
 * WEB 세션과 동일하게 동작시키려면 여기서 직접 쿠키로 심어야 한다.
 *
 * Path 는 반드시 '/' 여야 한다. middleware 가 페이지 요청에서 refreshToken 존재를 보고
 * AT 재발급 여부를 판단하기 때문이다.
 */
export function applyRefreshTokenCookie(res: NextResponse, token: string, maxAge: number): void {
  res.cookies.set({
    name: 'refreshToken',
    value: token,
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}
