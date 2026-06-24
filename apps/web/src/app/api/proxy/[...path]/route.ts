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
  headers.set('X-Client-Type', headers.get('X-Client-Type') ?? 'WEB');

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

  return buildResponse(upstream, setCookies);
}

async function buildResponse(upstream: Response, setCookies: string[]) {
  const contentType = upstream.headers.get('content-type') ?? '';

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

    applySetCookies(res, setCookies);

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

    return res;
  }

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: pickHeaders(upstream),
  });

  applySetCookies(res, setCookies);

  return res;
}

function applySetCookies(res: NextResponse, setCookies: string[]) {
  for (const c of setCookies) {
    const parsed = parseSetCookie(c);
    if (!parsed) continue;

    res.cookies.set({
      ...parsed,
      secure: !IS_DEV,
      sameSite: parsed.sameSite === 'none' ? 'lax' : parsed.sameSite,
      path: toProxyCookiePath(parsed.name, parsed.path),
    });
  }
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

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
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
  if (name === 'oauth_state') return '/';
  if (!path || path === '/') return path ?? '/';
  if (path.startsWith('/api/proxy')) return path;
  return `/api/proxy${path}`;
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
