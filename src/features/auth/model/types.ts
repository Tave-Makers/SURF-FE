export type AuthData = {
  accessToken: string | null;
  nickname: string | null;
  email: string | null;
  profileImageUrl: string | null;
};

export type AuthState = AuthData & {
  setAuth: (auth: AuthData) => void;
  clearAuth: () => void;
};

/**
 *  Amplitude 로그인 이벤트 이름
 */
export const AUTH_EVENTS = {
  LOGIN_KAKAO_CLICK: 'login_kakao',
  LOGIN_CALLBACK: 'login_callback',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAIL: 'login_fail',
} as const;

/**
 * Amplitude 이벤트별 속성 타입 매핑
 */
export type AuthEventPropsMap = {
  [AUTH_EVENTS.LOGIN_KAKAO_CLICK]: { login_method: string };
  [AUTH_EVENTS.LOGIN_CALLBACK]: { code_length: number };
  [AUTH_EVENTS.LOGIN_SUCCESS]: { user_id: string };
  [AUTH_EVENTS.LOGIN_FAIL]: { error_code: number };
};
