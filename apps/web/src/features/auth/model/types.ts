import type { UserLevel } from '@/entities/user/model/types';

export type AuthData = {
  memberId: number | null;
  memberRole: UserLevel | null;
};

export type AuthState = AuthData & {
  setAuth: (auth: Partial<AuthData>) => void;
  clearAuth: () => void;
};

/**
 *  Amplitude 로그인 이벤트 이름
 */
export const AUTH_EVENTS = {
  CLICK_LOGIN_KAKAO: 'click_login_kakao',
  VIEW_LOGIN_CALLBACK: 'view_login_callback',
} as const;

/**
 * Amplitude 이벤트별 속성 타입 매핑
 */
export type AuthEventPropsMap = {
  [AUTH_EVENTS.CLICK_LOGIN_KAKAO]: { login_method: string };
  [AUTH_EVENTS.VIEW_LOGIN_CALLBACK]: { code_length: number };
};
