import { API_BASE_URL } from '@/shared/config/env';
import { trackEvent } from '@/shared/lib/trackEvent';
import { AUTH_EVENTS } from '../model/types';

export const kakaoLogin = () => {
  window.location.href = `${API_BASE_URL}/login/kakao`;
  trackEvent(AUTH_EVENTS.LOGIN_KAKAO_CLICK, { login_method: 'kakao' });
};
