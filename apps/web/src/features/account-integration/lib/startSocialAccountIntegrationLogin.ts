import type { SocialProvider } from '../api/types';
import { savePendingSocialAccountIntegration } from './pendingSocialAccountIntegration';
import { appleLogin } from '@/features/auth/lib/appleLogin';
import { kakaoLogin } from '@/features/auth/lib/kakaoLogin';
import { canNativeSocialLogin, postToNative } from '@/shared/lib/nativeBridge';

export type StartSocialAccountIntegrationLoginResult =
  | {
      ok: true;
      /** 'native' 면 이 페이지를 떠나지 않는다. 로그인을 취소하면 그대로 돌아온다 */
      via: 'native' | 'redirect';
    }
  | { ok: false; reason: 'storage_unavailable' | 'write_failed' };

/**
 * 연동 대상 계정으로 다시 로그인한다.
 *
 * 어느 경로로 로그인하든 끝은 /login/callback 이고, 거기서 useOAuthCallback 이
 * sessionStorage 에 남겨둔 통합 토큰을 읽어 연동을 마무리한다.
 * 그래서 로그인은 반드시 지금 이 브라우징 컨텍스트 안에서 끝나야 한다.
 */
export function startSocialAccountIntegrationLogin(
  provider: SocialProvider,
  integrationToken: string,
): StartSocialAccountIntegrationLoginResult {
  const saveResult = savePendingSocialAccountIntegration({ provider, integrationToken });
  if (!saveResult.ok) return saveResult;

  // 앱에서는 네이티브 SDK 로그인에 맡긴다. 웹 리다이렉트를 그대로 쓰면
  // 카카오 인증 화면이 WebView 안에 열려 카카오톡 로그인을 쓸 수 없다.
  if (canNativeSocialLogin()) {
    postToNative({ type: 'SOCIAL_LOGIN', provider });
    return { ok: true, via: 'native' };
  }

  if (provider === 'KAKAO') {
    kakaoLogin();
    return { ok: true, via: 'redirect' };
  }

  appleLogin();
  return { ok: true, via: 'redirect' };
}
