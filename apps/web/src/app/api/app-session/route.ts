import { NextRequest, NextResponse } from 'next/server';

import { exchangeAppLogin, type AppLoginCredential } from '@/features/auth/api/exchangeAppLogin';
import { setOAuthOnboardingCookie } from '@/features/auth/lib/onboardingCookie';
import { applyAccessTokenCookie, applyRefreshTokenCookie } from '@/shared/lib/proxyCookie';

export const runtime = 'nodejs';

/**
 * 네이티브 앱(WebView) 전용 세션 수립 엔드포인트.
 *
 * 앱은 카카오/애플 SDK 토큰만 넘기고, 여기서 백엔드 APP 로그인 API 로 교환한 뒤
 * WEB 흐름과 똑같은 쿠키를 심는다. 이렇게 하면 미들웨어·프록시·토큰 재발급이
 * 전부 기존 웹 경로 그대로 동작하고, 앱은 SURF JWT 를 들고 있을 필요가 없다.
 */

// 백엔드 JWT_REFRESH_EXPIRATION(14일)과 맞춰야 한다. 더 길게 잡으면 이미 죽은 RT 로 재발급을 시도하게 된다.
// accessToken 쿠키(30분)는 shared/lib/proxyCookie.ts 의 applyAccessTokenCookie 가 관리한다.
// /auth/refresh 는 RTR(회전)이라 재발급 때마다 백엔드가 새 쿠키를 내려주고 만료가 갱신된다.
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 14;

const APP_CLIENT_HEADER = 'x-surf-client';
const APP_CLIENT_VALUE = 'APP';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readNonEmptyString(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readOptionalString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

function parseCredential(body: unknown): AppLoginCredential | null {
  if (!isRecord(body)) return null;

  if (body.provider === 'kakao') {
    const accessToken = readNonEmptyString(body, 'accessToken');
    return accessToken ? { provider: 'kakao', accessToken } : null;
  }

  if (body.provider === 'apple') {
    const identityToken = readNonEmptyString(body, 'identityToken');
    const nonce = readNonEmptyString(body, 'nonce');
    if (!identityToken || !nonce) return null;

    return {
      provider: 'apple',
      identityToken,
      nonce,
      authorizationCode: readOptionalString(body, 'authorizationCode'),
      name: readOptionalString(body, 'name'),
    };
  }

  return null;
}

/**
 * 다른 사이트가 피해자 브라우저로 이 엔드포인트를 호출해 공격자 세션을 심는 걸 막는다.
 * 커스텀 헤더는 CORS preflight 없이는 붙일 수 없고, 우리는 preflight 에 응답하지 않는다.
 */
function isTrustedCaller(req: NextRequest): boolean {
  if (req.headers.get(APP_CLIENT_HEADER) !== APP_CLIENT_VALUE) return false;

  const origin = req.headers.get('origin');
  if (!origin) return true;

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!isTrustedCaller(req)) {
    return NextResponse.json({ ok: false, message: '허용되지 않은 요청이에요.' }, { status: 403 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const credential = parseCredential(body);
  if (!credential) {
    return NextResponse.json(
      { ok: false, message: '로그인 요청이 올바르지 않아요.' },
      { status: 400 },
    );
  }

  const result = await exchangeAppLogin(credential);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message },
      { status: result.status && result.status < 500 ? result.status : 502 },
    );
  }

  const { accessToken, refreshToken, nickname, email, profileImageUrl } = result.data;

  const res = NextResponse.json({ ok: true });
  applyAccessTokenCookie(res, accessToken);
  applyRefreshTokenCookie(res, refreshToken, REFRESH_TOKEN_MAX_AGE);
  // /login/callback 의 useOAuthCallback 이 읽어가는 온보딩 정보. WEB 콜백과 동일하게 맞춘다.
  setOAuthOnboardingCookie(res, { nickname, email, profileImageUrl });

  return res;
}
