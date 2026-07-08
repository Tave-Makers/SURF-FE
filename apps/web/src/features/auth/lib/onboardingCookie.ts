import { NextResponse } from 'next/server';

import type { OAuthLoginData } from '../api/types';

export const OAUTH_ONBOARDING_COOKIE = 'oauth-onboarding';
const OAUTH_ONBOARDING_PATH = '/api/auth/oauth/onboarding';
const OAUTH_ONBOARDING_MAX_AGE = 60 * 5;

const IS_DEV = process.env.NODE_ENV !== 'production';

export function setOAuthOnboardingCookie(res: NextResponse, data: OAuthLoginData) {
  res.cookies.set({
    name: OAUTH_ONBOARDING_COOKIE,
    value: JSON.stringify(data),
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'lax',
    path: OAUTH_ONBOARDING_PATH,
    maxAge: OAUTH_ONBOARDING_MAX_AGE,
  });
}

export function clearOAuthOnboardingCookie(res: NextResponse) {
  res.cookies.delete({
    name: OAUTH_ONBOARDING_COOKIE,
    path: OAUTH_ONBOARDING_PATH,
  });
}

export function parseOAuthOnboardingCookie(value: string | undefined): OAuthLoginData | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const data = parsed as Record<string, unknown>;
    if (typeof data.email !== 'string') return null;

    return {
      nickname: typeof data.nickname === 'string' ? data.nickname : '',
      email: data.email,
      profileImageUrl: typeof data.profileImageUrl === 'string' ? data.profileImageUrl : '',
    };
  } catch {
    return null;
  }
}
