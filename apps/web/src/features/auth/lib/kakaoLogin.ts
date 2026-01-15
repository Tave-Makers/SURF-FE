import { AUTH_EVENTS } from '../model/types';
import { trackAuthEvent } from './trackAuthEvent';

export const kakaoLogin = () => {
  trackAuthEvent(AUTH_EVENTS.CLICK_LOGIN_KAKAO, { login_method: 'kakao' });
  window.location.href = '/api/proxy/login/kakao';
};
