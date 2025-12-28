// src/app/api/proxy/[...path]/route.ts
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

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}
export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return proxy(req, ctx.params.path);
}

async function proxy(req: NextRequest, path: string[]) {
  const targetUrl = new URL(`${BACKEND.replace(/\/+$/, '')}/${path.join('/')}`);
  // querystring 보존
  targetUrl.search = req.nextUrl.search;

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();

  // ✅ 원 요청 헤더 복사 + hop-by-hop 제거
  const headers = new Headers(req.headers);
  for (const key of HOP_BY_HOP) headers.delete(key);

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  // ✅ redirect는 "그대로" 전달 (location + status + set-cookie)
  const location = upstream.headers.get('location');
  if (location) {
    const res = new NextResponse(null, { status: upstream.status });
    res.headers.set('location', location);

    for (const c of getSetCookies(upstream)) res.headers.append('set-cookie', c);
    return res;
  }

  // ✅ 일반 응답 (body + status + 일부 헤더 + set-cookie)
  const res = new NextResponse(upstream.body, { status: upstream.status });

  // 필요한 헤더만 최소 전달
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

  // set-cookie가 여러 개면 원래는 깨질 수 있음(이 fallback은 한 개만 처리)
  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}
