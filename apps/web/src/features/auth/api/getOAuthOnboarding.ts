import type { OAuthLoginData } from './types';

type GetOAuthOnboardingSuccess = {
  ok: true;
  data: OAuthLoginData;
};

type GetOAuthOnboardingFailure = {
  ok: false;
  message: string;
};

type GetOAuthOnboardingResponse = GetOAuthOnboardingSuccess | GetOAuthOnboardingFailure;

export async function getOAuthOnboarding(signal?: AbortSignal): Promise<OAuthLoginData> {
  const res = await fetch('/api/auth/oauth/onboarding', { cache: 'no-store', signal });
  const body = (await res.json()) as GetOAuthOnboardingResponse;

  if (!res.ok || !body.ok) {
    throw new Error(body.ok ? '온보딩 정보를 불러오지 못했어요.' : body.message);
  }

  return body.data;
}
