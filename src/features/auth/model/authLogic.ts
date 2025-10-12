import { getKakaoLoginCallback } from '../api/getKakaoLoginCallback';

import { useAuthStore } from './useAuthStore';
import { trackAuthEvent } from '../lib/trackAuthEvent';
import { AUTH_EVENTS } from './types';
import axios from 'axios';
import { ErrorResponse } from '@/shared/lib/handleApiError';

export async function handleKakaoLoginCallback(code: string): Promise<string> {
  const setAuth = useAuthStore.getState().setAuth;
  const memberId = useAuthStore.getState().memberId;

  // 콜백 이벤트 트래킹
  trackAuthEvent(AUTH_EVENTS.LOGIN_CALLBACK, { code_length: code.length });

  try {
    // 카카오 로그인 콜백
    const res = await getKakaoLoginCallback(code);

    // 로그인 성공 이벤트 트래킹
    trackAuthEvent(AUTH_EVENTS.LOGIN_SUCCESS, {
      user_id: String(memberId ?? 'unknown'),
    });

    setAuth({
      accessToken: res.data.accessToken,
      nickname: res.data.nickname,
      email: res.data.email,
      profileImageUrl: res.data.profileImageUrl,
    });

    return '/home';
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      // axios 에러인 경우
      const statusCode = error.response?.status ?? 500;
      trackAuthEvent(AUTH_EVENTS.LOGIN_FAIL, { error_code: statusCode });
    } else {
      // axios 외의 에러
      trackAuthEvent(AUTH_EVENTS.LOGIN_FAIL, { error_code: 500 });
    }

    throw error;
  }
}
