import type { SocialProvider } from '../api/types';
import {
  savePendingSocialAccountIntegration,
  type SavePendingSocialAccountIntegrationResult,
} from './pendingSocialAccountIntegration';
import { appleLogin } from '@/features/auth/lib/appleLogin';
import { kakaoLogin } from '@/features/auth/lib/kakaoLogin';

export function startSocialAccountIntegrationLogin(
  provider: SocialProvider,
  integrationToken: string,
): SavePendingSocialAccountIntegrationResult {
  const saveResult = savePendingSocialAccountIntegration({ provider, integrationToken });
  if (!saveResult.ok) return saveResult;

  if (provider === 'KAKAO') {
    kakaoLogin();
    return saveResult;
  }

  appleLogin();
  return saveResult;
}
