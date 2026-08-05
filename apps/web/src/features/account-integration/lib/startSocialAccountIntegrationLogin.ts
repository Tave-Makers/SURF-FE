import type { SocialProvider } from '../api/types';
import { savePendingSocialAccountIntegration } from './pendingSocialAccountIntegration';
import { appleLogin } from '@/features/auth/lib/appleLogin';
import { kakaoLogin } from '@/features/auth/lib/kakaoLogin';

export function startSocialAccountIntegrationLogin(
  provider: SocialProvider,
  integrationToken: string,
) {
  savePendingSocialAccountIntegration({ provider, integrationToken });

  if (provider === 'KAKAO') {
    kakaoLogin();
    return;
  }

  appleLogin();
}
