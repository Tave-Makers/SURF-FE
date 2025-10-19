export type AuthData = {
  accessToken: string | null;
  nickname: string | null;
  email: string | null;
  profileImageUrl: string | null;
  memberId: number | null;
};

export type AuthState = AuthData & {
  setAuth: (auth: Partial<AuthData>) => void;
  clearAuth: () => void;
};

/**
 *  이벤트 이름
 */
export const AUTH_EVENTS = {
  LOGIN_KAKAO_CLICK: 'login_kakao',
  // LOGIN_SUCCESS: 'login_success',
  // LOGIN_FAIL: 'login_fail',
} as const;

/**
 * 이벤트별 속성 타입 매핑
 */
export type AuthEventPropsMap = {
  [AUTH_EVENTS.LOGIN_KAKAO_CLICK]: { login_method: string };
  // [AUTH_EVENTS.LOGIN_SUCCESS]: { member_id: string };
  // [AUTH_EVENTS.LOGIN_FAIL]: { error_code: number };
};
