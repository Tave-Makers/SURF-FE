import { NextRequest, NextResponse } from 'next/server';
import { exchangeAppleLogin } from '@/features/auth/api/exchangeAppleLogin';
import { applyProxyAuthToResponse } from '@/features/auth/lib/applyProxyAuthResponse';
import { PAGE_ROUTES } from '@/shared/config/path';

export const runtime = 'nodejs';

const LOGIN_CALLBACK = '/login/apple/callback';

function getFormString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === 'string' ? value : undefined;
}

function getBaseUrl(req: NextRequest): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host = req.headers.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const baseUrl = getBaseUrl(req);

  const error = getFormString(formData, 'error');
  if (error) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl));
  }

  const code = getFormString(formData, 'code');
  const state = getFormString(formData, 'state');
  const user = getFormString(formData, 'user');

  if (!code || !state) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.LOGIN, baseUrl));
  }

  const result = await exchangeAppleLogin(
    { code, state, user },
    'http://localhost:3000',
    req.headers.get('cookie') ?? undefined,
  );

  if (!result.ok) {
    const loginUrl = new URL(PAGE_ROUTES.LOGIN, baseUrl);
    loginUrl.searchParams.set('msg', result.message);
    return NextResponse.redirect(loginUrl);
  }

  const { nickname, email, profileImageUrl } = result.data;
  const redirectUrl = new URL(LOGIN_CALLBACK, baseUrl);
  redirectUrl.searchParams.set('provider', 'apple');
  redirectUrl.searchParams.set('nickname', nickname);
  redirectUrl.searchParams.set('email', email);
  redirectUrl.searchParams.set('profileImageUrl', profileImageUrl);

  const response = NextResponse.redirect(redirectUrl);
  applyProxyAuthToResponse(response, result.upstream, result.parsed);

  return response;
}
