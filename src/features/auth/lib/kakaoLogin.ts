import { API_BASE_URL } from '@/shared/config/env';
import { AUTH_EVENTS } from '../model/types';
import { trackAuthEvent } from './trackAuthEvent';

export const kakaoLogin = () => {
  trackAuthEvent(AUTH_EVENTS.LOGIN_KAKAO_CLICK, { login_method: 'kakao' });
  window.location.href = `${API_BASE_URL}/login/kakao`;
};
