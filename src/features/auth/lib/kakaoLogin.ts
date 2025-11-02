import { API_BASE_URL } from '@/shared/config/env';
import { AUTH_EVENTS } from '../model/types';
import { trackAuthEvent } from './trackAuthEvent';

export const kakaoLogin = () => {
  trackAuthEvent(AUTH_EVENTS.CLICK_LOGIN_KAKAO, { login_method: 'kakao' });
  window.location.href = `${API_BASE_URL}/login/kakao`;
};
