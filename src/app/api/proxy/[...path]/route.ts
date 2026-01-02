import { NextRequest, NextResponse } from 'next/server';

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

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  const res = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') || '',
      'cache-control': upstream.headers.get('cache-control') || '',
    },
  });

  const location = upstream.headers.get('location');
  if (location) res.headers.set('location', location);

  // 모든 Set-Cookie 헤더 처리
  const rawCookies = getSetCookies(upstream);

  rawCookies.forEach((cookieStr) => {
    // 로컬 개발 환경에서 저장이 가능하도록 속성 변경
    const modifiedCookie = cookieStr
      .replace(/Domain=[^;]+;?\s*/gi, '') // 백엔드 도메인 설정 제거
      .replace(/Secure;?\s*/gi, ''); // http 환경에서도 저장 가능하도록 제거

    res.headers.append('set-cookie', modifiedCookie);
  });

  return res;
}

function getSetCookies(res: Response): string[] {
  const headers = res.headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie() ?? [];
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}
