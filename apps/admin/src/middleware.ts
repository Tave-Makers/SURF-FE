import { NextRequest, NextResponse } from 'next/server';

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
  '/onboarding',
];
const PUBLIC_EXACT = ['/'];

const LOGIN_PATH = '/login';
const AUTH_REFRESH_PATH = '/auth/refresh';
const REFRESH_TIMEOUT_MS = 10_000;

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

  let url: URL;
  try {
    url = new URL(`${base}${AUTH_REFRESH_PATH}`);
  } catch {
    console.error('[Auth] API_BASE_URL이 올바른 URL 형식이 아닙니다');
    return null;
  }

  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    console.error('[Auth] 프로덕션에서는 refresh 요청에 https만 허용합니다');
    return null;
  }

  return url.toString();
}

function parseJson(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

/**
 * AT JWT 의 exp 클레임만 읽는다(서명 검증 아님) — "갱신이 필요한가"를 판단하는
 * 용도라, 위조된 값이 통과해도 실제 인가는 백엔드가 Authorization 헤더로 다시
 * 검증한다. 만료 10초 이내도 갱신 대상으로 봐서 요청 도중 만료되는 걸 막는다.
 */
function isAccessTokenFresh(token: string): boolean {
  const payload = token.split('.')[1];
  if (!payload) return false;

  try {
    const { exp } = JSON.parse(base64UrlDecode(payload)) as { exp?: unknown };
    return typeof exp === 'number' && exp * 1000 > Date.now() + 10_000;
  } catch {
    return false;
  }
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
    // 구체적인 사유는 buildRefreshUrl 내부에서 이미 로깅됨
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      redirect: 'error',
      signal: controller.signal,
      headers: {
        'X-Client-Type': 'WEB',
        'X-Refresh-Origin': 'middleware',
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
  const body = parseJson(await upstream.text());
  const accessToken = extractAccessToken(body);

  // 새 AT 를 못 받았으면 갱신 실패로 본다
  if (!accessToken) return null;

  const headers = new Headers(req.headers);
  headers.set('cookie', buildForwardedCookieHeader(req, accessToken));

  const res = NextResponse.next({ request: { headers } });

  // proxy 경유 요청과 동일한 규칙(Path 재작성 포함)으로 브라우저에 쿠키 반영
  const sessionCleared = applyUpstreamSetCookies(res, setCookies);

  // RT 를 지우는 응답이 왔다면 재발급이 아니라 세션 종료다.
  // 새 AT 를 심지 말고, 호출부가 redirectToLogin 으로 쿠키를 정리하게 둔다.
  if (sessionCleared) return null;

  applyAccessTokenCookie(res, accessToken);

  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API는 통과 (프록시/라우트핸들러)
  if (pathname.startsWith('/api')) return NextResponse.next();

  // public route 통과
  if (PUBLIC_EXACT.includes(pathname)) return NextResponse.next();
  if (PUBLIC_PREFIX.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // AT 가 실제로 살아있으면 통과 (쿠키 존재만으론 안 본다 — exp 까지 확인)
  const accessToken = req.cookies.get('accessToken')?.value;
  if (accessToken && isAccessTokenFresh(accessToken)) return NextResponse.next();

  // AT 도 RT 도 없으면 진짜 비로그인
  if (!req.cookies.has('refreshToken')) return redirectToLogin(req);

  // prefetch 로는 RT 를 소모하지 않는다 (RT 회전 레이스 방지)
  if (req.headers.get('next-router-prefetch') === '1') return NextResponse.next();

  // AT 가 없거나 만료됨 -> RT 로 재발급하고 통과 (RSC는 재발급을 시도하지 않는다 —
  // 쿠키를 못 심어서 RT 만 태우고 브라우저는 옛 값을 계속 보내게 된다)
  const refreshed = await refreshSession(req);
  return refreshed ?? redirectToLogin(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
