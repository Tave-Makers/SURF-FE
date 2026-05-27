import { AUTH_EVENTS } from '../model/types';
import { trackAuthEvent } from './trackAuthEvent';

export const appleLogin = () => {
  trackAuthEvent(AUTH_EVENTS.CLICK_LOGIN_APPLE, { login_method: 'apple' });
  window.location.href = '/api/proxy/login/apple';
};
