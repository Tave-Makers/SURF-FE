import { NextRequest, NextResponse } from 'next/server';

import { applyProxyAuthToResponse } from '@/features/auth/lib/applyProxyAuthResponse';
import { applyUpstreamSetCookies, getSetCookies } from '@/shared/lib/proxyCookie';

export const runtime = 'nodejs';

const BACKEND = process.env.API_BASE_URL!;

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

  console.log('[proxy] upstream status:', upstream.status);
  console.log('[proxy] upstream content-type:', upstream.headers.get('content-type'));

  return buildResponse(upstream);
}

async function buildResponse(upstream: Response) {
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

    // OAuth 콜백 라우트와 같은 규칙을 쓴다. 여기서 따로 구현하면 규칙이 갈라진다.
    applyProxyAuthToResponse(res, upstream, parsed);

    return res;
  }

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: pickHeaders(upstream),
  });

  // 본문이 JSON 이 아니면 심을 토큰도 없다. 쿠키만 그대로 넘긴다.
  applyUpstreamSetCookies(res, getSetCookies(upstream));

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
