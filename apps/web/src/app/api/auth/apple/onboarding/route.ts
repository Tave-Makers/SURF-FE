import { NextRequest, NextResponse } from 'next/server';

import {
  clearOAuthOnboardingCookie,
  OAUTH_ONBOARDING_COOKIE,
  parseOAuthOnboardingCookie,
} from '@/features/auth/lib/onboardingCookie';

export const runtime = 'nodejs';

export function GET(req: NextRequest) {
  const data = parseOAuthOnboardingCookie(req.cookies.get(OAUTH_ONBOARDING_COOKIE)?.value);

  if (!data) {
    return NextResponse.json(
      { ok: false, message: '온보딩 정보가 없거나 만료됐어요.' },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true, data });
  clearOAuthOnboardingCookie(res);
  return res;
}
