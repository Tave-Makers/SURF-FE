import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

const BACKEND = process.env.API_BASE_URL!;
const IS_DEV = process.env.NODE_ENV !== 'production';

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

type Ctx = { params: Promise<{ path: string[] }> };

async function handler(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;

async function proxy(req: NextRequest, path: string[]) {
  const base = BACKEND.replace(/\/+$/, '');
  const targetUrl = new URL(`${base}/${path.join('/')}`);
  targetUrl.search = req.nextUrl.search;

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();

  const headers = new Headers(req.headers);
  for (const key of HOP_BY_HOP) headers.delete(key);

  const accessToken = req.cookies.get('accessToken')?.value;
  if (accessToken && !headers.has('authorization')) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  const setCookies = getSetCookies(upstream);
  console.log('[proxy] upstream status:', upstream.status);
  console.log('[proxy] upstream content-type:', upstream.headers.get('content-type'));
  console.log('[proxy] upstream set-cookie:', setCookies);

  return buildResponse(upstream, setCookies, path);
}

async function buildResponse(upstream: Response, setCookies: string[], path: string[]) {
  const contentType = upstream.headers.get('content-type') ?? '';
  const refreshValueFromUpstream = findCookieValue(setCookies, 'refreshToken');

  if (contentType.includes('application/json')) {
    const text = await upstream.text();

    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    const res = new NextResponse(text, {
      status: upstream.status,
      headers: pickHeaders(upstream),
    });

    if (!IS_DEV) {
      for (const c of setCookies) res.headers.append('set-cookie', c);
    } else {
      if (refreshValueFromUpstream) {
        res.cookies.set({
          name: 'refreshToken',
          value: refreshValueFromUpstream,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/auth/refresh',
        });
      }
    }

    const token = extractAccessToken(parsed);
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

    if (isLogoutPath(path) || isWithdrawPath(path)) {
      clearAccessTokenCookie(res);
      clearRefreshTokenCookie(res);
    }

    return res;
  }

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: pickHeaders(upstream),
  });

  if (!IS_DEV) {
    for (const c of setCookies) res.headers.append('set-cookie', c);
  } else {
    if (refreshValueFromUpstream) {
      res.cookies.set({
        name: 'refreshToken',
        value: refreshValueFromUpstream,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/auth/refresh',
      });
    }
  }

  if (isLogoutPath(path) || isWithdrawPath(path)) {
    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
  }

  return res;
}

function pickHeaders(upstream: Response): Record<string, string> {
  const headers: Record<string, string> = {};
  const ct = upstream.headers.get('content-type');
  const cc = upstream.headers.get('cache-control');
  const loc = upstream.headers.get('location');
  if (ct) headers['content-type'] = ct;
  if (cc) headers['cache-control'] = cc;
  if (loc) headers['location'] = loc;
  return headers;
}

function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

function findCookieValue(setCookies: string[], cookieName: string): string | null {
  for (const c of setCookies) {
    const first = c.split(';', 1)[0];
    const eqIdx = first.indexOf('=');
    if (eqIdx <= 0) continue;
    const name = first.slice(0, eqIdx).trim();
    if (name !== cookieName) continue;
    const value = first.slice(eqIdx + 1);
    return value || null;
  }
  return null;
}

function isLogoutPath(path: string[]): boolean {
  return path.length >= 2 && path[0] === 'auth' && path[1] === 'logout';
}

function isWithdrawPath(path: string[]): boolean {
  return (
    path.length >= 4 &&
    path[0] === 'v1' &&
    path[1] === 'user' &&
    path[2] === 'members' &&
    path[3] === 'withdraw'
  );
}

function clearAccessTokenCookie(res: NextResponse) {
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

function clearRefreshTokenCookie(res: NextResponse) {
  res.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 0,
  });
}

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
