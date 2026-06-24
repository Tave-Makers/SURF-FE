import type { OAuthLoginData } from './types';

type GetAppleOnboardingSuccess = {
  ok: true;
  data: OAuthLoginData;
};

type GetAppleOnboardingFailure = {
  ok: false;
  message: string;
};

type GetAppleOnboardingResponse = GetAppleOnboardingSuccess | GetAppleOnboardingFailure;

export async function getAppleOnboarding(): Promise<OAuthLoginData> {
  const res = await fetch('/api/auth/apple/onboarding', { cache: 'no-store' });
  const body = (await res.json()) as GetAppleOnboardingResponse;

  if (!res.ok || !body.ok) {
    throw new Error(body.ok ? '온보딩 정보를 불러오지 못했어요.' : body.message);
  }

  return body.data;
}
