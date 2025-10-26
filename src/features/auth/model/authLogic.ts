import { getKakaoLoginCallback } from '../api/getKakaoLoginCallback';
import { useAuthStore } from './useAuthStore';
import { AUTH_EVENTS } from './types';
import { trackAuthEvent } from '../lib/trackAuthEvent';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function handleKakaoLoginCallback(code: string): Promise<string> {
  const setAuth = useAuthStore.getState().setAuth;

  trackAuthEvent(AUTH_EVENTS.LOGIN_CALLBACK, {
    code_length: code.length,
  });

  try {
    const res = await getKakaoLoginCallback(code);

    setAuth({
      accessToken: res.data.accessToken,
      nickname: res.data.nickname,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
    });

    return '/home';
  } catch (err) {
    const loginError = handleApiError(
      err,
      '카카오 로그인에 실패했어요. 잠시 후 다시 시도해주세요.',
    );
    throw loginError;
  }
}
