import { NextRequest, NextResponse } from 'next/server';
import { exchangeOAuthLogin } from '@/features/auth/api/exchangeOAuthLogin';
import { setOAuthOnboardingCookie } from '@/features/auth/lib/onboardingCookie';
import { applyProxyAuthToResponse } from '@/features/auth/lib/applyProxyAuthResponse';
import { PAGE_ROUTES } from '@/shared/config/path';
import { getAppOriginFromRequest } from '@/shared/lib/appOrigin';

export const runtime = 'nodejs';

const LOGIN_CALLBACK = '/login/callback';

function getFormString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === 'string' ? value : undefined;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const baseUrl = getAppOriginFromRequest(req);

  const error = getFormString(formData, 'error');
  if (error) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl), 303);
  }

  const code = getFormString(formData, 'code');
  const state = getFormString(formData, 'state');
  const user = getFormString(formData, 'user');

  if (!code || !state) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl), 303);
  }

  const result = await exchangeOAuthLogin({
    provider: 'apple',
    code,
    state,
    user,
    origin: baseUrl,
    cookieHeader: req.headers.get('cookie') ?? undefined,
  });

  if (!result.ok) {
    const loginUrl = new URL(PAGE_ROUTES.LOGIN, baseUrl);
    loginUrl.searchParams.set('msg', result.message);
    return NextResponse.redirect(loginUrl, 303);
  }

  const { nickname, email, profileImageUrl } = result.data;
  const redirectUrl = new URL(LOGIN_CALLBACK, baseUrl);

  const response = NextResponse.redirect(redirectUrl, 303);
  setOAuthOnboardingCookie(response, { nickname, email, profileImageUrl });
  applyProxyAuthToResponse(response, result.upstream, result.parsed);

  return response;
}
