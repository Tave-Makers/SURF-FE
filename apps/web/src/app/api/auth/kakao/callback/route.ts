import { NextRequest, NextResponse } from 'next/server';
import { exchangeOAuthLogin } from '@/features/auth/api/exchangeOAuthLogin';
import { applyProxyAuthToResponse } from '@/features/auth/lib/applyProxyAuthResponse';
import { setOAuthOnboardingCookie } from '@/features/auth/lib/onboardingCookie';
import { PAGE_ROUTES } from '@/shared/config/path';
import { getAppOriginFromRequest } from '@/shared/lib/appOrigin';

export const runtime = 'nodejs';

const LOGIN_CALLBACK = '/login/callback';

export async function GET(req: NextRequest) {
  const baseUrl = getAppOriginFromRequest(req);

  const error = req.nextUrl.searchParams.get('error');
  if (error) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl));
  }

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl));
  }

  const result = await exchangeOAuthLogin({
    provider: 'kakao',
    code,
    state,
    origin: baseUrl,
    cookieHeader: req.headers.get('cookie') ?? undefined,
  });

  if (!result.ok) {
    const loginUrl = new URL(PAGE_ROUTES.LOGIN, baseUrl);
    loginUrl.searchParams.set('msg', result.message);
    return NextResponse.redirect(loginUrl);
  }

  const { nickname, email, profileImageUrl } = result.data;
  const response = NextResponse.redirect(new URL(LOGIN_CALLBACK, baseUrl));
  setOAuthOnboardingCookie(response, { nickname, email, profileImageUrl });
  applyProxyAuthToResponse(response, result.upstream, result.parsed);

  return response;
}
