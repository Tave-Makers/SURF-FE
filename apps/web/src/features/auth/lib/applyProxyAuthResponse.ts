import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function extractAccessToken(v: unknown): string | null {
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

function parseSetCookie(cookie: string) {
  const [first, ...attributes] = cookie.split(';');
  const eqIdx = first.indexOf('=');
  if (eqIdx <= 0) return null;

  const parsed: {
    name: string;
    value: string;
    httpOnly?: boolean;
    maxAge?: number;
    expires?: Date;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
  } = {
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

function toProxyCookiePath(name: string, path?: string) {
  if (name === 'oauth_state') return '/api/auth';
  if (!path || path === '/') return path ?? '/';
  if (path.startsWith('/api/proxy')) return path;
  return `/api/proxy${path}`;
}

function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

export function applyProxyAuthToResponse(
  res: NextResponse,
  upstream: Response,
  parsedBody: unknown,
) {
  for (const c of getSetCookies(upstream)) {
    const parsed = parseSetCookie(c);
    if (!parsed) continue;

    res.cookies.set({
      ...parsed,
      secure: !IS_DEV,
      sameSite: parsed.sameSite === 'none' ? 'lax' : parsed.sameSite,
      path: toProxyCookiePath(parsed.name, parsed.path),
    });
  }

  const token = extractAccessToken(parsedBody);
  if (token) {
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
}
