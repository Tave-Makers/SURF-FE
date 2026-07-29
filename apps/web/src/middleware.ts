import { NextRequest, NextResponse } from 'next/server';

import { AUTH_REFRESH_PATH } from '@/shared/config/authPaths';
import {
  applyAccessTokenCookie,
  applyUpstreamSetCookies,
  extractAccessToken,
  getSetCookies,
} from '@/shared/lib/proxyCookie';

const PUBLIC_PREFIX = [
  '/login',
  '/login/callback',
  '/signup',
  '/favicon.ico',
  '/_next',
  '/robots.txt',
  '/sitemap.xml',
  '/terms-of-service',
  '/privacy-policy',
  '/operational-policy',
  '/icons',
  '/images',
  '/header-logo.svg',
  '/logo.svg',
];
const PUBLIC_EXACT = ['/'];

const LOGIN_PATH = '/login';
const ONBOARDING_PATH = '/onboarding';
const REFRESH_TIMEOUT_MS = 10_000;

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIX.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);
}

function redirectToLogin(req: NextRequest) {
  const res = NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  // 재발급까지 실패한 세션이므로 죽은 쿠키를 남기지 않는다
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');
  return res;
}

function buildRefreshUrl(): string | null {
  const base = process.env.API_BASE_URL?.replace(/\/+$/, '');
  if (!base) return null;
  return `${base}${AUTH_REFRESH_PATH}`;
}

/** 갱신된 AT 를 현재 요청에도 반영해서 서버 컴포넌트(dal.ts)가 새 토큰을 보게 한다 */
function buildForwardedCookieHeader(req: NextRequest, accessToken: string): string {
  const jar = new Map<string, string>();
  for (const c of req.cookies.getAll()) jar.set(c.name, c.value);
  jar.set('accessToken', accessToken);

  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function refreshSession(req: NextRequest): Promise<NextResponse | null> {
  const url = buildRefreshUrl();
  if (!url) {
    console.error('[Auth] API_BASE_URL is not configured');
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'X-Client-Type': 'WEB',
        cookie: req.headers.get('cookie') ?? '',
      },
    });
  } catch (e) {
    console.error('[Auth] refresh 요청 실패:', e instanceof Error ? e.message : String(e));
    return null;
  } finally {
    clearTimeout(timer);
  }

  if (!upstream.ok) return null;

  const setCookies = getSetCookies(upstream);

  let body: unknown = null;
  try {
    const text = await upstream.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  const accessToken = extractAccessToken(body);

  // 새 AT 를 못 받았으면 갱신 실패로 본다
  if (!accessToken) return null;

  const headers = new Headers(req.headers);
  headers.set('cookie', buildForwardedCookieHeader(req, accessToken));

  const res = NextResponse.next({ request: { headers } });

  // proxy 경유 요청과 동일한 규칙(Path 재작성 포함)으로 브라우저에 쿠키 반영
  applyUpstreamSetCookies(res, setCookies);
  applyAccessTokenCookie(res, accessToken);

  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API는 통과 (프록시/라우트핸들러)
  if (pathname.startsWith('/api')) return NextResponse.next();

  // public route 통과
  if (isPublicPath(pathname)) return NextResponse.next();

  // 온보딩은 (protected) 밖에 있어야 한다.
  // REGISTERING 의 리다이렉트 목적지라서 안에 넣으면 verifySession 이 무한 루프에 빠진다.
  // 대신 여기서 "카카오 인증은 마친 사람"만 통과시킨다.
  if (isOnboardingPath(pathname)) {
    const hasSession = req.cookies.has('accessToken') || req.cookies.has('refreshToken');
    return hasSession ? NextResponse.next() : redirectToLogin(req);
  }

  // AT 쿠키가 살아있으면 optimistic 통과 (실제 검증은 dal.ts)
  if (req.cookies.has('accessToken')) return NextResponse.next();

  // AT 도 RT 도 없으면 진짜 비로그인
  if (!req.cookies.has('refreshToken')) return redirectToLogin(req);

  // prefetch 로는 RT 를 소모하지 않는다 (RT 회전 레이스 방지)
  if (req.headers.get('next-router-prefetch') === '1') return NextResponse.next();

  // AT 만 만료 -> RT 로 재발급하고 통과
  const refreshed = await refreshSession(req);
  return refreshed ?? redirectToLogin(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
