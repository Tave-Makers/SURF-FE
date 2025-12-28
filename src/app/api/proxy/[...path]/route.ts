import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.API_BASE_URL;
if (!BACKEND) throw new Error('API_BASE_URL is not set');

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

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  const location = upstream.headers.get('location');
  if (location) {
    const res = new NextResponse(null, { status: upstream.status });
    res.headers.set('location', location);

    for (const c of getSetCookies(upstream)) res.headers.append('set-cookie', c);

    const cc = upstream.headers.get('cache-control');
    if (cc) res.headers.set('cache-control', cc);

    return res;
  }

  const res = new NextResponse(upstream.body, { status: upstream.status });

  for (const h of ['content-type', 'cache-control']) {
    const v = upstream.headers.get(h);
    if (v) res.headers.set(h, v);
  }

  for (const c of getSetCookies(upstream)) res.headers.append('set-cookie', c);

  console.log('[proxy] incoming', req.method, req.nextUrl.pathname, req.nextUrl.search);
  console.log('[proxy] target', targetUrl.toString());

  return res;
}

function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];

  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}
